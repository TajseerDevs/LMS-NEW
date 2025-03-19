const schedule = require('node-schedule');
const Notification = require('../models/Notification');


const createReminderNotification = async (reminder) => {

  try {

    const notification = new Notification({
      from: null,
      to: reminder.studentId,
      courseId: reminder.courseId,
      type: 'course_reminder',
      message: `Reminder: ${reminder.reminderName} `,
      status: 'sent',
    });

    await notification.save();
    console.log(`Notification sent to user ${reminder.studentId}`);
  } catch (error) {
    console.error('Error sending reminder notification:', error);
  }
};

const scheduleReminder = (reminder) => {

  let reminderDate = new Date(reminder.reminderDateTime)

  if (reminder.reminderType === 'once') {
    schedule.scheduleJob(reminderDate, () => {
      createReminderNotification(reminder);
    })
  } else if (reminder.reminderType === 'daily') {
    const timeParts = reminder.reminderTime.split(' ');
    const [hour, minute] = timeParts[0].split(':');
    const period = timeParts[1].toLowerCase(); 

    let reminderTime = new Date();
    reminderTime.setHours(period === 'pm' ? parseInt(hour) + 12 : parseInt(hour), parseInt(minute), 0);

    schedule.scheduleJob('0 0 * * *', () => { 
      createReminderNotification(reminder);
    });
  } else if (reminder.reminderType === 'weekly') {

    const reminderDaysMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };

    reminder.reminderDays.forEach(day => {

        const reminderDayOfWeek = reminderDaysMap[day];

      const timeParts = reminder.reminderTime.split(' ');
      const [hour, minute] = timeParts[0].split(':');
      const period = timeParts[1].toLowerCase();
      let reminderTime = new Date();

      reminderTime.setHours(period === 'pm' ? parseInt(hour) + 12 : parseInt(hour), parseInt(minute), 0);

      schedule.scheduleJob({hour: reminderTime.getHours(), minute: reminderTime.getMinutes(), dayOfWeek: reminderDayOfWeek}, () => {
        createReminderNotification(reminder);
      })

    })

  }

}


module.exports = { scheduleReminder }
