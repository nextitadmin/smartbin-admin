const demoReports = [
  {
    _id: '1',
    type: 'payment-history',
    reportName: 'Monthly Payment Report',
    period: { from: '01/01', to: '01/31' },
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    _id: '2',
    type: 'smartbin-request',
    reportName: 'Q1 Smartbin Requests',
    period: { from: '01/01', to: '03/31' },
    createdAt: '2023-04-01T14:20:00Z'
  },
  {
    _id: '3',
    type: 'waste-pickup',
    reportName: 'Weekly Waste Collection',
    period: { from: '02/15', to: '02/22' },
    createdAt: '2023-02-23T09:15:00Z'
  },
  {
    _id: '4',
    type: 'payment-history',
    reportName: 'Annual Revenue Summary',
    period: { from: '01/01', to: '12/31' },
    createdAt: '2023-12-31T18:00:00Z'
  },
  {
    _id: '5',
    type: 'smartbin-request',
    reportName: 'Corporate Smartbin Orders',
    period: { from: '03/01', to: '03/31' },
    createdAt: '2023-04-05T11:45:00Z'
  },
  {
    _id: '6',
    type: 'waste-pickup',
    reportName: 'Industrial Waste Report',
    period: { from: '04/01', to: '04/30' },
    createdAt: '2023-05-01T16:30:00Z'
  },
  {
    _id: '7',
    type: 'payment-history',
    reportName: 'Quarterly Financial Report',
    period: { from: '01/01', to: '03/31' },
    createdAt: '2023-04-10T08:45:00Z'
  },
  {
    _id: '8',
    type: 'smartbin-request',
    reportName: 'Residential Smartbin Deployments',
    period: { from: '02/01', to: '02/28' },
    createdAt: '2023-03-01T13:20:00Z'
  }
];

export default demoReports;