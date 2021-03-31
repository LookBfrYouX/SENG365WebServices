const events = require('../models/events.model')
const auth = require('../middleware/authorize.middleware')
const users = require('../models/users.model')

exports.view = async function(req, res) {
  try {
    var paginatedResults = [];
    const {q, categoryIds, organizerId, sortBy, count, startIndex} = req.query
    var results = (await events.getEvent(q, categoryIds, organizerId, sortBy))[0];
    let j = 0;
    for (let i=startIndex; i < results.length; i++) {
      if (j >= count) {
        break
      }
      var selectedEvent = results[i];
      console.log(selectedEvent);
      selectedEvent['categories'] = await events.getCategoriesById(selectedEvent.eventId)
      selectedEvent['numAcceptedAttendees'] = await events.getAcceptedAttendees(selectedEvent.eventId)
      paginatedResults.push(selectedEvent);
      j++;
  }
  if (paginatedResults.length === 0) {
    res.statusMessage = 'OK';
    res.status(200)
       .send(results);
  } else {
    res.statusMessage = 'OK';
    res.status(200)
       .send(paginatedResults);
  }

  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error'
    res.status(500)
      .send()
  }
  };

exports.add = async function(req, res) {
  try {
    var currentDate = new Date();
    if (await auth.Authorized(req, res)) {
      dbCategories = await events.getCategories();
      console.log(dbCategories);
      const allCategoryIds = [];
      for (i=0; i < dbCategories.length; i++) {
        allCategoryIds.push(dbCategories[i].id)
      }
      console.log(allCategoryIds);
      for (i=0; i < req.body.categoryIds.length; i++) {
        if (!(allCategoryIds.includes(req.body.categoryIds[i])) || !req.body.title || !req.body.description) {
            console.log(req.body.categoryIds[i])
            res.statusMessage = 'Bad Request';
            res.status(400)
               .send()
            return null;
        }
      }
      var title = req.body.title;
      var titleExists = await events.searchEventBy(`title = '${title}'`)
      if (titleExists === undefined) {
        res.statusMessage = 'Bad Request';
        res.status(400)
           .send()
      }
      var description = req.body.description;
      var categoryIds = req.body.categoryIds;
      var query = 'title, description, ';
      var values = "'" + title + "', '" + description + "', ";
      query += (req.body.date && new Date(req.body.date).getTime() > currentDate.getTime()) ? 'date, ' : '';
      query += (req.body.url) ?  'url, ' : '';
      query += (req.body.venue) ?  'venue, ' : '';
      query += (req.body.capacity) ?  'capacity, ' : '';
      query += (req.body.requires_attendance_control) ?  'requires_attendance_control, ' : '';
      query += (req.body.fee) ?  'fee, ' : '';

      if (req.body.date && (new Date(req.body.date).getTime() > currentDate.getTime())) {
        values += `'${req.body.date}', `
      }
      if (req.body.url) {
        values += `'${req.body.url}', `
      }

      if (req.body.venue) {
        values += `'${req.body.venue}', `
      }

      if (req.body.capacity) {
        values += `${req.body.capacity}, `
      }

      if (req.body.requires_attendance_control) {
        values += `${req.body.requires_attendance_control}, `
      }

      if (req.body.fee) {
        values += `${req.body.fee}, `
      }
      query += 'organizer_id';
      values += req.authenticatedUserId;
      await events.addEvent(query, values);
      eventID = (await events.searchEventBy(`title = '${title}'`))[0].id;
      for (i=0; i < categoryIds.length; i++) {
        console.log(categoryIds[i])
        await events.addCategory(eventID, categoryIds[i])
      }
      res.statusMessage = 'OK'
      res.status(200)
        .json({"eventId": eventID});

    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
         .send()
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error'
    res.status(500)
      .send()
  }
  };

exports.detailed = async function(req, res) {
  const id = req.params.id;
  try {
    const result = (await events.getDetails(parseInt(id)))[0];
    if (!result) {
      res.statusMessage = 'Not Found'
      res.status(404)
        .send()
    } else {
      res.statusMessage = 'OK'
      res.status(200)
        .json(result);
      }
    } catch(err) {
      console.log(err);
      res.statusMessage = 'Internal Server Error'
      res.status(500)
        .send()
  };
};

exports.edit = async function(req, res) {
  try {
    var eventid = req.params.id;
    var currentDate = new Date();
    if (await auth.Authorized(req, res)) {
      originalEvent = await events.searchEventBy(`id = ${eventid}`);
      organizer = originalEvent[0].organizer_id;
      user = await users.searchUserBy(`id = ${organizer}`);
      if (organizer === req.authenticatedUserId) {
        dbCategories = await events.getCategories()
        for (i=0; i <= req.body.categoryIds; i++) {
          if (!dbCategories.includes(req.body.categoryIds[i])) {
            res.statusMessage = 'Bad Request';
            res.status(400)
               .send()
          }
        }
        var query = '';
        query += (req.body.title) ? `title = '${req.body.title}', `: '';
        query += (req.body.description) ? `description = '${req.body.description}', `: '';
        query += (req.body.isOnline) ? `isOnline = ${req.body.isOnline}, `: '';
        query += (req.body.date && new Date(req.body.date).getTime() > currentDate.getTime()) ? `date = '${req.body.date}'` : '';
        query += (req.body.url) ? `url = '${req.body.url}', `: '';
        query += (req.body.venue) ? `venue = '${req.body.venue}', `: '';
        query += (req.body.capacity) ? `capacity = '${req.body.capacity}', `: '';
        query += (req.body.requires_attendance_control) ? `requires_attendance_control = '${req.body.requires_attendance_control}', `: '';
        query += (req.body.fee) ? `fee = ${req.body.fee}, `: '';
        query = query.slice(0,-2);
        await events.editEvent(query, parseInt(eventid));
        if (req.body.categoryIds) {
          for (i=0; i < req.body.categoryIds.length; i++) {
            await events.addCategory(eventid, req.body.categoryIds[i])
          }
        }
        res.statusMessage = 'OK'
        res.status(200)
          .send();
      } else {
        res.statusMessage = 'Forbidden';
        res.status(402)
           .send()
      }

    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
         .send()
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error'
    res.status(500)
      .send()
  }
  };

exports.delete = async function(req, res) {
  eventId = req.params.id;
  eventToChange = (await events.getDetails(eventId))[0];
  if (eventToChange) {
    if (await auth.Authorized(req, res)) {
      if (parseInt(eventToChange.organizer_id) === parseInt(req.authenticatedUserId)) {
        await events.deleteAttendees(eventId);
        await events.deleteCategories(eventId)
        await events.deleteEvent(eventId);
        res.statusMessage = 'OK'
        res.status(200)
           .send();

      } else {
        res.statusMessage = 'Forbidden'
        res.status(403)
           .send()
      }
    } else {
      res.statMessage = 'Unauthorized'
      res.status(401)
         .send()
    }
  } else {
    res.statMessage = 'Not Found'
    res.status(404)
       .send()
  }
  };

// works
exports.categories = async function(res, res) {
  try {
    const result = (await events.getCategoriesDetails());
    console.log(result);
    if (!result) {
      res.statusMessage = 'Not Found'
      res.status(404)
        .send()
    } else {
      res.statusMessage = 'OK'
      res.status(200)
        .json(result);
      }
    } catch(err) {
      console.log(err);
      res.statusMessage = 'Internal Server Error'
      res.status(500)
        .send()

  };
};
