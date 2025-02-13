const baseUrl = process.env.BASE_URL || 'http://implementation:8000';
module.exports = {
  settings: {},
  implementations: [
    {
      name: 'My Company',
      implementation: 'My Implementation Name',
      issuers: [
        {
          id: '',
          endpoint: `${baseUrl}/credentials/issue`,
          options: {},
          tags: ['vc2.0']
        }
      ],
      verifiers: [{
        id: '',
        endpoint: `${baseUrl}/credentials/verify`,
        options: {},
        tags: ['vc2.0']
      }],
      vpVerifiers: [{
        id: '',
        endpoint: `${baseUrl}/presentations/verify`,
        options: {},
        tags: ['vc2.0']
      }]
    }
  ]
};
