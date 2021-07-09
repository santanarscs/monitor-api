interface IMailConfig {
  driver: 'ethereal' | 'smtp';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'robo@monitor.com',
      name: 'Robomonitor',
    },
  },
} as IMailConfig;