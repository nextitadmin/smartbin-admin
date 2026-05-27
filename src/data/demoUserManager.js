const userDetails = {
    resident: [
      {
        userID: "0900AD01",
        name: "Adeniji James",
        lga: "Ibeju-Lekki",
        address: "12, Awolowo Road, Ikoyi, Lagos",
        email: "lorenipsumm89@gmail.com",
        phoneNumber: "09088767565",
        customerType: "Resident",
        pspCompany: "Bolaji & Co",
        subscription: "6 months ",
        expiration: "200 Days left",
        status: "Inactive",
        lastLogin: "6 month(s) ago"
      },
      {
        userID: "0900AD02",
        name: "Fatima Bello",
        lga: "Surulere",
        address: "8B, Bode Thomas Street, Surulere, Lagos",
        email: "fatima.bello@example.com",
        phoneNumber: "08033334455",
        customerType: "Resident",
        pspCompany: "CleanCity Services",
        subscription: "3 months",
        expiration: "45 Days left",
        status: "Active",
        lastLogin: "1 day(s) ago"
      },
      {
        userID: "0900AD03",
        name: "Chinedu Eze",
        lga: "Yaba",
        address: "15A, Herbert Macaulay Way, Yaba, Lagos",
        email: "chinedu.eze@example.com",
        phoneNumber: "08123456789",
        customerType: "Resident",
        pspCompany: "EcoWaste Solutions",
        subscription: "12 months",
        expiration: "250 Days left",
        status: "Active",
        lastLogin: "3 day(s) ago"
      },
      {
        userID: "0900AD04",
        name: "Grace Nwosu",
        lga: "Lekki",
        address: "7 Unity Road, Ajah, Lagos",
        email: "grace.nwosu@example.com",
        phoneNumber: "08059988776",
        customerType: "Resident",
        pspCompany: "GreenPath Waste",
        subscription: "6 months ",
        expiration: "120 Days left",
        status: "Active",
        lastLogin: "1 week(s) ago"
      },
      {
        userID: "0900AD05",
        name: "David Wilson",
        lga: "Victoria Island",
        address: "22C, Admiralty Way, Lekki, Lagos",
        email: "david.wilson@example.com",
        phoneNumber: "08045678901",
        customerType: "Resident",
        pspCompany: "MetroClean Services",
        subscription: "3 months",
        expiration: "27 Days left",
        status: "Inactive",
        lastLogin: "2 month(s) ago"
      }
    ],
  
    agent: [
      {
        userID: "AGT00234",
        name: "Ethan Clark",
        lga: "Lekki",
        address: "22C Admiralty Way, Lekki Phase 1, Lagos",
        email: "ethan.clark@example.com",
        phoneNumber: "07011122233",
        customerType: "Agent",
        agencyName: "GreenEarth Waste Services",
        registrationNumber: "REG-AGT-4521",
        subscription: "1 year",
        expiration: "211 Days left",
        status: "Active",
        lastLogin: "2 day(s) ago",
        applicants: [
          {
            userId: "APP001",
            name: "Michael Johnson",
            email: "michael.johnson@example.com",
            customerType: "Resident",
            phoneNumber: "08012345678",
            dateAdded: "2024-01-15"
          },
          {
            userId: "APP002",
            name: "Sarah Williams",
            email: "sarah.williams@example.com",
            customerType: "Corporate",
            phoneNumber: "08023456789",
            dateAdded: "2024-01-20"
          },
          {
            userId: "APP003",
            name: "David Brown",
            email: "david.brown@example.com",
            customerType: "Corporate",
            phoneNumber: "08034567890",
            dateAdded: "2024-02-01"
          },
          {
            userId: "APP004",
            name: "Lisa Davis",
            email: "lisa.davis@example.com",
            customerType: "Resident",
            phoneNumber: "08045678901",
            dateAdded: "2024-02-10"
          },
          {
            userId: "APP005",
            name: "Robert Wilson",
            email: "robert.wilson@example.com",
            customerType: "Resident",
            phoneNumber: "08056789012",
            dateAdded: "2024-02-15"
          }
        ]
      },
      {
        userID: "AGT00235",
        name: "John Doe",
        lga: "Ikeja",
        address: "12B, Allen Avenue, Ikeja, Lagos",
        email: "john.doe@example.com",
        phoneNumber: "08012345678",
        customerType: "Agent",
        agencyName: "CleanCity Agents Ltd",
        registrationNumber: "AGT-LA-000123",
        subscription: "6 months",
        expiration: "150 Days left",
        status: "Active",
        lastLogin: "1 day(s) ago",
        applicants: [
          {
            userId: "APP006",
            name: "Jennifer Martinez",
            email: "jennifer.martinez@example.com",
            customerType: "Corporate",
            phoneNumber: "08067890123",
            dateAdded: "2024-01-10"
          },
          {
            userId: "APP007",
            name: "Christopher Taylor",
            email: "christopher.taylor@example.com",
            customerType: "Corporate",
            phoneNumber: "08078901234",
            dateAdded: "2024-01-25"
          },
          {
            userId: "APP008",
            name: "Amanda Anderson",
            email: "amanda.anderson@example.com",
            customerType: "Resident",
            phoneNumber: "08089012345",
            dateAdded: "2024-02-05"
          },
          {
            userId: "APP009",
            name: "James Thompson",
            email: "james.thompson@example.com",
            customerType: "Resident",
            phoneNumber: "08090123456",
            dateAdded: "2024-02-12"
          },
          {
            userId: "APP010",
            name: "Maria Rodriguez",
            email: "maria.rodriguez@example.com",
            customerType: "Resident",
            phoneNumber: "08001234567",
            dateAdded: "2024-02-18"
          }
        ]
      },
      {
        userID: "AGT00236",
        name: "Olivia Garcia",
        lga: "Ajah",
        address: "9 Abraham Adesanya Estate, Ajah, Lagos",
        email: "olivia.garcia@example.com",
        phoneNumber: "08071234567",
        customerType: "Agent",
        agencyName: "GreenPath Agents",
        registrationNumber: "AGT-LA-000456",
        subscription: "12 months",
        expiration: "300 Days left",
        status: "Active",
        lastLogin: "4 day(s) ago",
        applicants: [
          {
            userId: "APP011",
            name: "Patricia White",
            email: "patricia.white@example.com",
            customerType: "Corporate",
            phoneNumber: "08012345678",
            dateAdded: "2024-01-08"
          },
          {
            userId: "APP012",
            name: "Michael Harris",
            email: "michael.harris@example.com",
            customerType: "Resident",
            phoneNumber: "08023456789",
            dateAdded: "2024-01-22"
          },
          {
            userId: "APP013",
            name: "Linda Clark",
            email: "linda.clark@example.com",
            customerType: "Corporate",
            phoneNumber: "08034567890",
            dateAdded: "2024-02-03"
          },
          {
            userId: "APP014",
            name: "William Lewis",
            email: "william.lewis@example.com",
            customerType: "Corporate",
            phoneNumber: "08045678901",
            dateAdded: "2024-02-08"
          },
          {
            userId: "APP015",
            name: "Barbara Walker",
            email: "barbara.walker@example.com",
            customerType: "Resident",
            phoneNumber: "08056789012",
            dateAdded: "2024-02-20"
          }
        ]
      },
      {
        userID: "AGT00237",
        name: "Samuel Adeyemi",
        lga: "Surulere",
        address: "16 Bode Thomas Street, Surulere, Lagos",
        email: "samuel.adeyemi@example.com",
        phoneNumber: "08062233445",
        customerType: "Agent",
        agencyName: "EnviroServe Agents",
        registrationNumber: "AGT-LA-000321",
        subscription: "3 months",
        expiration: "75 Days left",
        status: "Inactive",
        lastLogin: "1 month(s) ago",
        applicants: [
          {
            userId: "APP016",
            name: "Elizabeth Hall",
            email: "elizabeth.hall@example.com",
            customerType: "Resident",
            phoneNumber: "08067890123",
            dateAdded: "2024-01-12"
          },
          {
            userId: "APP017",
            name: "Thomas Allen",
            email: "thomas.allen@example.com",
            customerType: "Corporate",
            phoneNumber: "08078901234",
            dateAdded: "2024-01-28"
          },
          {
            userId: "APP018",
            name: "Susan Young",
            email: "susan.young@example.com",
            customerType: "Corporate",
            phoneNumber: "08089012345",
            dateAdded: "2024-02-07"
          },
          {
            userId: "APP019",
            name: "Daniel King",
            email: "daniel.king@example.com",
            customerType: "Resident",
            phoneNumber: "08090123456",
            dateAdded: "2024-02-14"
          },
          {
            userId: "APP020",
            name: "Nancy Wright",
            email: "nancy.wright@example.com",
            customerType: "Corporate",
            phoneNumber: "08001234567",
            dateAdded: "2024-02-22"
          }
        ]
      }
    ],
  
    corporate: [
      {
        userID: "CORP0098",
        name: "GlobeMart Ltd.",
        lga: "Victoria Island",
        address: "Plot 5, Adetokunbo Ademola St, VI, Lagos",
        businessEmail: "contact@globemart.com",
        businessPhone: "08033445566",
        customerType: "Corporate",
        pspCompany: "CleanLagos Waste Ltd.",
        subscription: "12 months ",
        expiration: "60 Days left",
        status: "Active",
        lastLogin: "1 week(s) ago"
      },
      {
        userID: "CORP0099",
        name: "Brown Industries",
        lga: "Apapa",
        address: "18 Creek Road, Apapa, Lagos",
        businessEmail: "contact@brownindustries.com",
        businessPhone: "08056789012",
        customerType: "Corporate",
        pspCompany: "EcoServe Nigeria",
        subscription: "24 months ",
        expiration: "119 Days left",
        status: "Active",
        lastLogin: "3 day(s) ago"
      },
      {
        userID: "CORP0100",
        name: "Miller Corp",
        lga: "Ikoyi",
        address: "15 Awolowo Road, Ikoyi, Lagos",
        businessEmail: "info@millercorp.com",
        businessPhone: "08011223344",
        customerType: "Corporate",
        pspCompany: "GreenPath Waste",
        subscription: "6 months",
        expiration: "90 Days left",
        status: "Active",
        lastLogin: "5 day(s) ago"
      },
      {
        userID: "CORP0101",
        name: "Anderson Retail",
        lga: "Victoria Island",
        address: "2 Idowu Martins Street, VI, Lagos",
        businessEmail: "hello@andersonretail.com",
        businessPhone: "08091112233",
        customerType: "Corporate",
        pspCompany: "MetroClean Services",
        subscription: "12 months",
        expiration: "130 Days left",
        status: "Inactive",
        lastLogin: "2 week(s) ago"
      },
      {
        userID: "CORP0102",
        name: "Brown Consulting",
        lga: "Ikoyi",
        address: "18 Awolowo Road, Ikoyi, Lagos",
        businessEmail: "office@brownconsulting.com",
        businessPhone: "08056677889",
        customerType: "Corporate",
        pspCompany: "CleanCity Services",
        subscription: "18 months ",
        expiration: "200 Days left",
        status: "Active",
        lastLogin: "2 day(s) ago"
      }
    ],
  
    facilityManager: [
      {
        userID: "FM00312",
        name: "Mia Thompson",
        phoneNumber: "08099988776",
        binID: "#OD12589123",
        binStatus: "Active",
        dateAdded: "18-09-25",
        buildingName: "Rosewood Apartments",
        lga: "Yaba",
        address: "5B Herbert Macaulay Way, Yaba, Lagos",
        email: "mia.thompson@example.com",
        customerType: "Facility Manager",
        branchName: "Yaba Office",
        branchAddress: "Herbert Macaulay St, Yaba",
        pspCompany: "EcoServe Nigeria",
        subscription: "3 months",
        expiration: "35 Days left",
        status: "Inactive",
        lastLogin: "3 month(s) ago",
        applicants: [
          {
            userId: "APP021",
            name: "Alexandra Smith",
            binId: "#BIN001",
            phoneNumber: "08011112222",
            binStatus: "assigned",
            addedDate: "2024-01-15"
          },
          {
            userId: "APP022",
            name: "Benjamin Johnson",
            binId: "#BIN002",
            phoneNumber: "08022223333",
            binStatus: "unassigned",
            addedDate: "2024-01-20"
          },
          {
            userId: "APP023",
            name: "Catherine Brown",
            binId: "#BIN003",
            phoneNumber: "08033334444",
            binStatus: "assigned",
            addedDate: "2024-02-01"
          },
          {
            userId: "APP024",
            name: "David Wilson",
            binId: "#BIN004",
            phoneNumber: "08044445555",
            binStatus: "assigned",
            addedDate: "2024-02-10"
          },
          {
            userId: "APP025",
            name: "Elena Garcia",
            binId: "#BIN005",
            phoneNumber: "08055556666",
            binStatus: "unassigned",
            addedDate: "2024-02-15"
          }
        ]
      },
      {
        userID: "FM00313",
        name: "Sarah Johnson",
        phoneNumber: "08098765432",
        binID: "#OD99887766",
        binStatus: "Active",
        dateAdded: "15-09-25",
        buildingName: "Cedar Heights",
        lga: "Surulere",
        address: "7A, Bode Thomas Street, Surulere, Lagos",
        email: "sarah.johnson@example.com",
        customerType: "Facility Manager",
        branchName: "Surulere Office",
        branchAddress: "Bode Thomas St, Surulere",
        pspCompany: "CleanCity Services",
        subscription: "6 months",
        expiration: "80 Days left",
        status: "Active",
        lastLogin: "1 day(s) ago",
        applicants: [
          {
            userId: "APP026",
            name: "Frank Miller",
            binId: "#BIN006",
            phoneNumber: "08066667777",
            binStatus: "assigned",
            addedDate: "2024-01-18"
          },
          {
            userId: "APP027",
            name: "Grace Lee",
            binId: "#BIN007",
            phoneNumber: "08077778888",
            binStatus: "assigned",
            addedDate: "2024-01-25"
          },
          {
            userId: "APP028",
            name: "Henry Davis",
            binId: "#BIN008",
            phoneNumber: "08088889999",
            binStatus: "unassigned",
            addedDate: "2024-02-05"
          },
          {
            userId: "APP029",
            name: "Isabella Rodriguez",
            binId: "#BIN009",
            phoneNumber: "08099990000",
            binStatus: "assigned",
            addedDate: "2024-02-12"
          },
          {
            userId: "APP030",
            name: "James Taylor",
            binId: "#BIN010",
            phoneNumber: "08000001111",
            binStatus: "unassigned",
            addedDate: "2024-02-18"
          }
        ]
      },
      {
        userID: "FM00314",
        name: "Emma Davis",
        phoneNumber: "08099988776",
        binID: "#OD11223344",
        binStatus: "Active",
        dateAdded: "20-09-25",
        buildingName: "Eko Towers",
        lga: "Victoria Island",
        address: "5B, Adetokunbo Ademola Street, VI, Lagos",
        email: "emma.davis@example.com",
        customerType: "Facility Manager",
        branchName: "VI Office",
        branchAddress: "Adetokunbo Ademola St, VI",
        pspCompany: "GreenPath Waste",
        subscription: "12 months",
        expiration: "260 Days left",
        status: "Active",
        lastLogin: "2 day(s) ago",
        applicants: [
          {
            userId: "APP031",
            name: "Kevin Anderson",
            binId: "#BIN011",
            phoneNumber: "08011112222",
            binStatus: "assigned",
            addedDate: "2024-01-22"
          },
          {
            userId: "APP032",
            name: "Lisa Martinez",
            binId: "#BIN012",
            phoneNumber: "08022223333",
            binStatus: "assigned",
            addedDate: "2024-01-28"
          },
          {
            userId: "APP033",
            name: "Michael Thompson",
            binId: "#BIN013",
            phoneNumber: "08033334444",
            binStatus: "unassigned",
            addedDate: "2024-02-08"
          },
          {
            userId: "APP034",
            name: "Nancy White",
            binId: "#BIN014",
            phoneNumber: "08044445555",
            binStatus: "assigned",
            addedDate: "2024-02-14"
          },
          {
            userId: "APP035",
            name: "Oliver Harris",
            binId: "#BIN015",
            phoneNumber: "08055556666",
            binStatus: "unassigned",
            addedDate: "2024-02-20"
          }
        ]
      },
      {
        userID: "FM00315",
        name: "Charlotte Perez",
        phoneNumber: "08076543210",
        binID: "#OD55667788",
        binStatus: "Maintenance",
        dateAdded: "10-09-25",
        buildingName: "Port Complex",
        lga: "Apapa",
        address: "3 Creek Road, Apapa, Lagos",
        email: "charlotte.perez@example.com",
        customerType: "Facility Manager",
        branchName: "Apapa Office",
        branchAddress: "Creek Road, Apapa",
        pspCompany: "MetroClean Services",
        subscription: "3 months",
        expiration: "15 Days left",
        status: "Active",
        lastLogin: "1 week(s) ago",
        applicants: [
          {
            userId: "APP036",
            name: "Patricia Clark",
            binId: "#BIN016",
            phoneNumber: "08066667777",
            binStatus: "assigned",
            addedDate: "2024-01-30"
          },
          {
            userId: "APP037",
            name: "Quentin Lewis",
            binId: "#BIN017",
            phoneNumber: "08077778888",
            binStatus: "unassigned",
            addedDate: "2024-02-02"
          },
          {
            userId: "APP038",
            name: "Rachel Walker",
            binId: "#BIN018",
            phoneNumber: "08088889999",
            binStatus: "assigned",
            addedDate: "2024-02-09"
          },
          {
            userId: "APP039",
            name: "Samuel Hall",
            binId: "#BIN019",
            phoneNumber: "08099990000",
            binStatus: "assigned",
            addedDate: "2024-02-16"
          },
          {
            userId: "APP040",
            name: "Tina Young",
            binId: "#BIN020",
            phoneNumber: "08000001111",
            binStatus: "unassigned",
            addedDate: "2024-02-22"
          }
        ]
      },
      {
        userID: "FM00316",
        name: "Daniel Martinez",
        phoneNumber: "08065432198",
        binID: "#OD33445566",
        binStatus: "Unassigned",
        dateAdded: "25-09-25",
        buildingName: "Express Plaza",
        lga: "Oshodi",
        address: "6B, Oshodi Expressway, Oshodi, Lagos",
        email: "daniel.martinez@example.com",
        customerType: "Facility Manager",
        branchName: "Oshodi Office",
        branchAddress: "Oshodi Expressway, Oshodi",
        pspCompany: "EcoWaste Solutions",
        subscription: "6 months",
        expiration: "45 Days left",
        status: "Inactive",
        lastLogin: "2 month(s) ago",
        applicants: [
          {
            userId: "APP041",
            name: "Ulysses King",
            binId: "#BIN021",
            phoneNumber: "08011112222",
            binStatus: "unassigned",
            addedDate: "2024-02-01"
          },
          {
            userId: "APP042",
            name: "Victoria Wright",
            binId: "#BIN022",
            phoneNumber: "08022223333",
            binStatus: "assigned",
            addedDate: "2024-02-06"
          },
          {
            userId: "APP043",
            name: "William Lopez",
            binId: "#BIN023",
            phoneNumber: "08033334444",
            binStatus: "unassigned",
            addedDate: "2024-02-11"
          },
          {
            userId: "APP044",
            name: "Xavier Hill",
            binId: "#BIN024",
            phoneNumber: "08044445555",
            binStatus: "assigned",
            addedDate: "2024-02-17"
          },
          {
            userId: "APP045",
            name: "Yolanda Scott",
            binId: "#BIN025",
            phoneNumber: "08055556666",
            binStatus: "unassigned",
            addedDate: "2024-02-24"
          }
        ]
      }
    ]
  };
  

  export default userDetails;