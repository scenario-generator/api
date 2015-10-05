module.exports = {

  Containers: {
    DefaultStyle: {
      top: '75px'
    },
  },

  NotificationItem: { // Override the notification item
    DefaultStyle: { // Applied only to the success notification item
      color: '#3d5560',
      borderTopColor: '#3d5560',
      backgroundColor: '#4dbcc6',
      borderWidth: '4px 0px 0px',

      isVisible: {
        opacity: 1
      }
    },
  },

  Action: {
    DefaultStyle: {
      backgroundColor: 'transparent',
      color: 'white',
      textDecoration: 'underline',
      padding: '0px 5px'
    },
  },

  Dismiss: {
    DefaultStyle: {
      backgroundColor: 'none',
      color: '#ffffff'
    },
  }
};