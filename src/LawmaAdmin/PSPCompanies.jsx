import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/LawmaAdmin/Sidebar";
import Topbar from "../components/LawmaAdmin/Topbar";
import { SearchIcon, ArrowLeftIcon } from "../components/icons";
import { addMember, fetchMembers, activateMember, deactivateMember } from "../api/pspApi";
import PSPCompaniesSkeletonLoader from "../components/PSPCompaniesSkeletonLoader";

// --- SVG Icon Components (Raw SVG from Heroicons) ---

// const SearchIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className="w-5 h-5 text-zinc-500"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//     />
//   </svg>
// );

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const ExportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
    />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 text-green-700"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 text-red-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);


// --- Main App Component ---
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPsp = location.state?.psp || null;
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [actionType, setActionType] = useState(null); // 'activate' or 'deactivate'
  const [successAction, setSuccessAction] = useState(null); // Track which action succeeded

  // Fetch data on component mount
  useEffect(() => {
    if (!selectedPsp?.id) {
      setIsLoading(false);
      return;
    }

    const loadMembers = async () => {
      try {
        const response = await fetchMembers(selectedPsp.id);
        
        // Check if response is an array, if not, check for common data structures
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.data)) {
          data = response.data;
        } else if (response && Array.isArray(response.members)) {
          data = response.members;
        } else if (response && Array.isArray(response.results)) {
          data = response.results;
        } else {
          console.warn("Unexpected API response format:", response);
          data = [];
        }
        
        // Transform API data to match expected format
        const transformedData = data.map((member, index) => ({
          id: member._id || member.id || index + 1,
          name: member.name || member.full_name || '',
          email: member.email || '',
          phone: member.phone_number || member.phone || '',
          status: member.status || 'Active',
          dateAdded: member.createdAt ? 
            new Date(member.createdAt).toLocaleDateString("en-GB", { 
              day: '2-digit', 
              month: '2-digit', 
              year: '2-digit' 
            }).replace(/\//g, "-") :
            new Date().toLocaleDateString("en-GB", { 
              day: '2-digit', 
              month: '2-digit', 
              year: '2-digit' 
            }).replace(/\//g, "-")
        }));
        
        setMembers(transformedData);
        setFilteredMembers(transformedData);
      } catch (error) {
        console.error("Error fetching members:", error);
        // Fallback to empty array on error
        setMembers([]);
        setFilteredMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [selectedPsp?.id]);

  // Handle search filtering
  useEffect(() => {
    const results = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, members]);

  const handleAddMember = async (newMemberData) => {
    try {
      // Prepare payload with the correct field names expected by backend
      const payload = {
        name: newMemberData.name,
        email: newMemberData.email,
        phone_number: newMemberData.phone,
        // company_name: selectedPsp?.companyName || newMemberData.company
      };

      const addResponse = await addMember(selectedPsp?.id, payload);
      
      // Refresh the members list from the API
      const fetchResponse = await fetchMembers(selectedPsp.id);
      
      // Check if response is an array, if not, check for common data structures
      let updatedData = [];
      if (Array.isArray(fetchResponse)) {
        updatedData = fetchResponse;
      } else if (fetchResponse && Array.isArray(fetchResponse.data)) {
        updatedData = fetchResponse.data;
      } else if (fetchResponse && Array.isArray(fetchResponse.members)) {
        updatedData = fetchResponse.members;
      } else if (fetchResponse && Array.isArray(fetchResponse.results)) {
        updatedData = fetchResponse.results;
      } else {
        console.warn("Unexpected API response format:", fetchResponse);
        updatedData = [];
      }
      
      const transformedData = updatedData.map((member, index) => ({
        id: member._id || member.id || index + 1,
        name: member.name || member.full_name || '',
        email: member.email || '',
        phone: member.phone_number || member.phone || '',
        status: member.status || 'Active',
        dateAdded: member.createdAt ? 
          new Date(member.createdAt).toLocaleDateString("en-GB", { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit' 
          }).replace(/\//g, "-") :
          new Date().toLocaleDateString("en-GB", { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit' 
          }).replace(/\//g, "-")
      }));
      
      setMembers(transformedData);
      setFilteredMembers(transformedData);
      
      return addResponse;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const triggerSuccess = (action = null) => {
    setSuccessAction(action);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setSuccessAction(null);
    }, 3000);
  };

  const triggerFailure = () => {
    setShowFailureModal(true);
    setTimeout(() => setShowFailureModal(false), 3000);
  };

  const handleActivateMember = (member) => {
    console.log('Activating member:', member);
    setSelectedMember(member);
    setActionType('activate');
    setShowConfirmModal(true);
  };

  const handleDeactivateMember = (member) => {
    console.log('Deactivating member:', member);
    setSelectedMember(member);
    setActionType('deactivate');
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!selectedMember || !actionType) return;

    console.log('Confirming action:', { actionType, selectedMember, memberId: selectedMember.id });

    try {
      if (actionType === 'activate') {
        console.log('Calling activateMember with ID:', selectedMember.id);
        await activateMember(selectedMember.id);
      } else {
        console.log('Calling deactivateMember with ID:', selectedMember.id);
        await deactivateMember(selectedMember.id);
      }

      // Refresh the members list
      const fetchResponse = await fetchMembers(selectedPsp.id);
      
      let updatedData = [];
      if (Array.isArray(fetchResponse)) {
        updatedData = fetchResponse;
      } else if (fetchResponse && Array.isArray(fetchResponse.data)) {
        updatedData = fetchResponse.data;
      } else if (fetchResponse && Array.isArray(fetchResponse.members)) {
        updatedData = fetchResponse.members;
      } else if (fetchResponse && Array.isArray(fetchResponse.results)) {
        updatedData = fetchResponse.results;
      }
      
      const transformedData = updatedData.map((member, index) => ({
        id: member._id || member.id || index + 1,
        name: member.name || member.full_name || '',
        email: member.email || '',
        phone: member.phone_number || member.phone || '',
        status: member.status || 'Active',
        dateAdded: member.createdAt ? 
          new Date(member.createdAt).toLocaleDateString("en-GB", { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit' 
          }).replace(/\//g, "-") :
          new Date().toLocaleDateString("en-GB", { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit' 
          }).replace(/\//g, "-")
      }));
      
      setMembers(transformedData);
      setFilteredMembers(transformedData);
      
      console.log('Action completed successfully');
      setShowConfirmModal(false);
      setSelectedMember(null);
      setActionType(null);
      triggerSuccess(actionType);
    } catch (error) {
      console.error(`Error ${actionType}ing member:`, error);
      console.error('Error details:', error.response?.data || error.message);
      setShowConfirmModal(false);
      setSelectedMember(null);
      setActionType(null);
      triggerFailure();
    }
  };

  const cancelAction = () => {
    setShowConfirmModal(false);
    setSelectedMember(null);
    setActionType(null);
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="flex justify-between">
              <div>
                <header className="mb-6 flex gap-4">
                  <button
                    onClick={() => navigate("/psp-management")}
                    className="flex items-center text-zinc-700 hover:text-green-800 mb-3"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                  <div>
                  <h1 className="text-3xl font-bold text-zinc-900">
                    {selectedPsp?.companyName || "Company"}
                  </h1>
                  <p className="text-sm text-zinc-500">Staff members</p>
                  </div>
                </header>
              </div>

              <div>
                <button
                  onClick={openAddModal}
                  className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
                >
                  <PlusIcon />
                  <span className="ml-2">Add member</span>
                </button>
              </div>
            </div>

            {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="relative w-full md:w-auto md:flex-grow max-w-xs">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search members"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border bg-white border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button className="flex items-center justify-center w-full md:w-auto px-4 py-2 border bg-white border-zinc-300 rounded-md text-zinc-700 hover:bg-zinc-100 transition-colors">
                    Export data
                  </button>
                </div>
              </div>

            {/* Show skeleton loader when loading */}
            {isLoading && <PSPCompaniesSkeletonLoader />}

            {/* Show table when not loading and has data */}
            {!isLoading && filteredMembers.length > 0 && (
              <div className="bg-white border border-zinc-200 rounded-lg p-4">
                {/* Members Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-300">
                        <th className="p-3 text-sm font-semibold text-zinc-600 uppercase">
                          S/N
                        </th>
                        <th className="p-3 text-sm font-semibold text-zinc-600 w-auto uppercase">
                          Name
                        </th>
                        <th className="p-3 text-sm font-semibold text-zinc-600 md:table-cell uppercase">
                          Email address
                        </th>
                        <th className="p-3 text-sm font-semibold text-zinc-600  md:table-cell uppercase">
                          Phone number
                        </th>
                        <th className="p-3 text-sm font-semibold text-zinc-600 md:table-cell uppercase">
                          Status
                        </th>
                        <th className="p-3 text-sm font-semibold text-zinc-600 md:table-cell min-w-[120px] uppercase">
                          Date added
                        </th>
                        <th className="p-3 text-sm font-semibold text-zinc-600 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member, index) => (
                        <tr
                          key={member.id}
                          className="border-b border-zinc-200 hover:bg-zinc-50"
                        >
                          <td className="p-3 text-zinc-500">{index + 1}</td>
                          <td className="p-3 text-sm text-zinc-800">
                            {member.name}
                          </td>
                          <td className="p-3 text-sm text-zinc-500 md:table-cell text-zinc-800">
                            {member.email}
                          </td>
                          <td className="p-3 text-sm text-zinc-500 md:table-cell text-zinc-800">
                            {member.phone}
                          </td>
                          <td className="p-3 text-sm md:table-cell text-zinc-800">
                            <span
                              className={`text-sm font-medium capitalize ${
                                member.status === "Active" || member.status === "active"
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-zinc-500 md:table-cell">
                            {member.dateAdded}
                          </td>
                          <td className="p-3">
                            {member.status === "Active" || member.status === "active" ? (
                              <button 
                                onClick={() => handleDeactivateMember(member)}
                                className="text-sm text-red-500 hover:text-red-700 font-semibold"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleActivateMember(member)}
                                className="text-sm text-green-500 hover:text-green-700 font-semibold"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Show message when no data is available and not loading */}
            {!isLoading && filteredMembers.length === 0 && (
              <div className="mt-20 p-8 text-center">
                <div className="text-zinc-500">
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">No active member available </h3>
                  <p className="text-zinc-500 text-sm">
                    This PSP doesn't have any team members yet. Click "Add member" to get started.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modals */}
          {showAddModal && (
            <AddMemberModal
              onClose={closeAddModal}
              onAddMember={handleAddMember}
              triggerSuccess={triggerSuccess}
              triggerFailure={triggerFailure}
              selectedPsp={selectedPsp}
            />
          )}
          {showSuccessModal && <SuccessModal action={successAction} />}
          {showFailureModal && <FailureModal />}
          {showConfirmModal && (
            <ConfirmModal
              member={selectedMember}
              actionType={actionType}
              onConfirm={confirmAction}
              onCancel={cancelAction}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// --- Modal Components ---

const AddMemberModal = ({
  onClose,
  onAddMember,
  triggerSuccess,
  triggerFailure,
  selectedPsp,
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState(selectedPsp?.companyName || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddMember({ name, company, email, phone });
      triggerSuccess();
      onClose();
    } catch (error) {
      triggerFailure();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 flex justify-between items-center border-b border-zinc-200">
          <div>
            <h2 className="text-lg font-bold">Add member</h2>
            <p className="text-sm text-zinc-500">Add a new new member</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800"
          >
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Company name
            </label>
            <input
              type="text"
              id="company"
              value={company}
              readOnly
              className="w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-50 text-zinc-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ action }) => {
  const getSuccessMessage = () => {
    switch (action) {
      case 'activate':
        return {
          title: 'Member Activated!',
          message: 'Member has been successfully activated'
        };
      case 'deactivate':
        return {
          title: 'Member Deactivated!',
          message: 'Member has been successfully deactivated'
        };
      default:
        return {
          title: 'Successful!',
          message: 'PSP On-boarded successfully'
        };
    }
  };

  const { title, message } = getSuccessMessage();

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm p-8 flex flex-col items-center text-center">
        <CheckCircleIcon />
        <h2 className="text-2xl font-bold mt-4">{title}</h2>
        <p className="text-zinc-600 mt-2">{message}</p>
      </div>
    </div>
  );
};

const FailureModal = () => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
    <div className="bg-white rounded-lg w-full max-w-sm p-8 flex flex-col items-center text-center">
      <ExclamationCircleIcon />
      <h2 className="text-2xl font-bold mt-4 text-red-700">Failed!</h2>
      <p className="text-zinc-600 mt-2">
        Could not on-board PSP. Please try again.
      </p>
    </div>
  </div>
);

const ConfirmModal = ({ member, actionType, onConfirm, onCancel }) => {
  const isActivate = actionType === 'activate';
  const actionText = isActivate ? 'activate' : 'deactivate';
  const actionColor = isActivate ? 'green' : 'red';
  
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-4">
            {/* <div className={`w-12 h-12 rounded-full bg-${actionColor}-100 flex items-center justify-center mr-4`}>
              <ExclamationCircleIcon className={`w-6 h-6 text-${actionColor}-600`} />
            </div> */}
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                {isActivate ? 'Activate' : 'Deactivate'} Member
              </h2>
              <p className="text-sm text-zinc-500">
                Are you sure you want to {actionText} this member?
              </p>
            </div>
          </div>
          
          {member && (
            <div className="bg-zinc-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-zinc-900 mb-2">Member Details:</h3>
              <p className="text-sm text-zinc-600"><strong>Name:</strong> {member.name}</p>
              <p className="text-sm text-zinc-600"><strong>Email:</strong> {member.email}</p>
              <p className="text-sm text-zinc-600"><strong>Phone:</strong> {member.phone}</p>
              <p className="text-sm text-zinc-600">
                <strong>Current Status:</strong> 
                <span className={`ml-1 font-medium ${
                  member.status === "Active" || member.status === "active" 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {member.status}
                </span>
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-zinc-600 border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors ${
                isActivate 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isActivate ? 'Activate' : 'Deactivate'} Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
