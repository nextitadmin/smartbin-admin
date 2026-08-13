import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '../../icons';
import DocumentViewer from './DocumentViewer';

const ActorModals = ({
  // Modal states
  verificationModal,
  setVerificationModal,
  rejectionModal,
  setRejectionModal,
  membersModal,
  setMembersModal,
  userDetail,
  setUserDetail,
  isNinVerifyOpen,
  setIsNinVerifyOpen,
  isDocViewerOpen,
  setIsDocViewerOpen,

  // Data states
  selectedUser,
  setSelectedUser,
  selectedMember,
  setSelectedMember,
  currentDocument,
  setCurrentDocument,
  rejectionReason,
  setRejectionReason,
  isViewingDetails,
  setIsViewingDetails,

  // Functions
  handleApproveUser,
  handleRejectUser,
  HandleRejectModal,
  handleOpenNinVerify,
  handleCloseNinVerify,
  handleVerifyNin,
  handleOpenDocViewer,
  handleCloseDocViewer,
  getNinDocUrl,
  getAgentCertUrl,
  getMembersList,
  getVerificationStatus,
  isNinVerified,
  formatGenerationDate,
  activeTab
}) => {
  // Helper functions
  const getDocumentType = (url) => {
    if (!url) return 'pdf';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    }
    return 'pdf';
  };

  // Resident Verification Modal
  const renderResidentVerificationModal = () => {
    if (!verificationModal || !selectedUser || !(selectedUser.userType === 'Resident' || selectedUser.userType === 'resident')) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
            <button
              onClick={() => { setVerificationModal(false); setIsViewingDetails(false); }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Name", value: selectedUser.applicant || (selectedUser.userId ? `${selectedUser.userId.firstName} ${selectedUser.userId.lastName}` : "N/A") },
                  { label: "Email", value: selectedUser.email || selectedUser.userId?.email || "N/A" },
                  { label: "Phone number", value: selectedUser.phoneNumber || selectedUser.userId?.phoneNumber || selectedUser.phone || "N/A" },
                  { label: "Nationality", value: selectedUser.nationality || selectedUser.userId?.nationality || "N/A" },
                  { label: "Gender", value: selectedUser.gender || selectedUser.userId?.gender || "N/A" },
                  { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || "N/A" },
                  { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || "N/A", action: 'verifyNin' },
                  { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
                  { label: "Building type", value: selectedUser.buildingType || "N/A" },
                  { label: "House number", value: selectedUser.houseNumber || "N/A" },
                  { label: "Flat number", value: selectedUser.flatNumber || "N/A" },
                  { label: "LGA", value: selectedUser.lga ? (typeof selectedUser.lga === 'object' ? selectedUser.lga.name : selectedUser.lga) : "N/A" },
                  { label: "Closest landmark", value: selectedUser.closestLandmark || "N/A" },
                  { label: "Address", value: selectedUser.address || "N/A" },
                  { label: "User Type", value: selectedUser.userType },
                  { label: "Application Date", value: formatGenerationDate(selectedUser.date) },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between items-center gap-4">
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-3">
                      <p className="text-zinc-900">{field.value}</p>
                      {field.action === 'verifyNin' && !isNinVerified(selectedUser) && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={handleOpenNinVerify}
                        >
                          Verify NIN
                        </button>
                      )}
                      {field.action === 'verifyNin' && isNinVerified(selectedUser) && (
                        <span className="text-green-600 font-medium">
                          ✓ Verified
                        </span>
                      )}
                      {field.action === 'viewDoc' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getNinDocUrl(selectedUser), `${selectedUser.applicant} - NIN Document`)}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isViewingDetails ? (
              <div className="flex justify-end">
                <div className={`px-4 py-2 rounded-lg font-medium ${getVerificationStatus().bgColor} ${getVerificationStatus().color}`}>
                  Status: {getVerificationStatus().text}
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleApproveUser(selectedUser)}
                  type="button"
                  className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify user
                </button>
                <button
                  onClick={() => { setRejectionModal(true); setVerificationModal(false); }}
                  type="button"
                  className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject user
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Facility Manager Verification Modal
  const renderFacilityManagerVerificationModal = () => {
    if (!verificationModal || !selectedUser) {
      return null;
    }

    // Check if userType matches any facility manager variation
    const userType = selectedUser.userType?.toLowerCase();
    const isFacilityManager = userType === 'facility manager' ||
      userType === 'facility_manager' ||
      userType === 'facilitymanager' ||
      userType === 'facility' ||
      userType === 'facility manager';

    if (!isFacilityManager) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
            <button
              onClick={() => { setVerificationModal(false); setIsViewingDetails(false); }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Name", value: selectedUser.applicant || (selectedUser.userId ? `${selectedUser.userId.firstName} ${selectedUser.userId.lastName}` : "N/A") },
                  { label: "Email", value: selectedUser.email || selectedUser.userId?.email || "N/A" },
                  { label: "Phone number", value: selectedUser.phoneNumber || selectedUser.userId?.phoneNumber || selectedUser.phone || "N/A" },
                  { label: "Nationality", value: selectedUser.nationality || selectedUser.userId?.nationality || "N/A" },
                  { label: "Gender", value: selectedUser.gender || selectedUser.userId?.gender || "N/A" },
                  { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || selectedUser.LAWMACustomerType || "N/A" },
                  { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || "N/A", action: 'verifyNin' },
                  { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
                  { label: "Building type", value: selectedUser.buildingType || "N/A" },
                  { label: "House number", value: selectedUser.houseNo || "N/A" },
                  { label: "Flat number", value: selectedUser.flatNo || "N/A" },
                  { label: "LGA", value: selectedUser.lga ? (typeof selectedUser.lga === 'object' ? selectedUser.lga.name : selectedUser.lga) : "N/A" },
                  { label: "Closest landmark", value: selectedUser.ClosestLandmark || "N/A" },
                  { label: "Address", value: selectedUser.address || "N/A" },
                  { label: "User Type", value: selectedUser.userType },
                  { label: "Application Date", value: formatGenerationDate(selectedUser.date) },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between items-center gap-4">
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-3">
                      <p className="text-zinc-900">{field.value}</p>
                      {field.action === 'verifyNin' && !isNinVerified(selectedUser) && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={handleOpenNinVerify}
                        >
                          Verify NIN
                        </button>
                      )}
                      {field.action === 'verifyNin' && isNinVerified(selectedUser) && (
                        <span className="text-green-600 font-medium">
                          ✓ Verified
                        </span>
                      )}
                      {field.action === 'viewDoc' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getNinDocUrl(selectedUser), `${selectedUser.applicant} - NIN Document`)}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isViewingDetails ? (
              <div className="flex justify-end">
                <div className={`px-4 py-2 rounded-lg font-medium ${getVerificationStatus().bgColor} ${getVerificationStatus().color}`}>
                  Status: {getVerificationStatus().text}
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleApproveUser(selectedUser)}
                  type="button"
                  className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify user
                </button>
                <button
                  onClick={() => { setRejectionModal(true); setVerificationModal(false); }}
                  type="button"
                  className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject user
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Agent Verification Modal
  const renderAgentVerificationModal = () => {
    if (!verificationModal || !selectedUser || !(selectedUser.userType === 'Agent' || selectedUser.userType === 'agent')) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
            <button
              onClick={() => { setVerificationModal(false); setIsViewingDetails(false); }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Name", value: selectedUser.applicant || (selectedUser.userId ? `${selectedUser.userId.firstName} ${selectedUser.userId.lastName}` : "N/A") },
                  { label: "Email", value: selectedUser.email || selectedUser.userId?.email || "N/A" },
                  { label: "Phone Number", value: selectedUser.phoneNumber || selectedUser.userId?.phoneNumber || selectedUser.phone || "N/A" },
                  { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || selectedUser.LAWMACustomerType || "N/A" },
                  { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || "N/A", action: 'verifyNin' },
                  { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
                  { label: "Agency Name", value: selectedUser.agencyName || "N/A" },
                  { label: "Registration Number", value: selectedUser.RegNo || selectedUser.businessRegistrationNumber || "N/A" },
                  { label: "Business Email address", value: selectedUser.businessEmail || "N/A" },
                  { label: "Business Phone number", value: selectedUser.businessPhone || "N/A" },
                  { label: "Branch Name", value: selectedUser.Branch || "N/A" },
                  { label: "Branch Address", value: selectedUser.Branchaddress || "N/A" },
                  { label: "Agent Registration Certificate", value: selectedUser.AgentCertificate, action: 'viewAgentCert' },
                  { label: "User Type", value: selectedUser.userType },
                  { label: "Application Date", value: formatGenerationDate(selectedUser.date) },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between items-center gap-4">
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-3">
                      <p className="text-zinc-900">{field.value}</p>
                      {field.action === 'verifyNin' && !isNinVerified(selectedUser) && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={handleOpenNinVerify}
                        >
                          Verify NIN
                        </button>
                      )}
                      {field.action === 'verifyNin' && isNinVerified(selectedUser) && (
                        <span className="text-green-600 font-medium">
                          ✓ Verified
                        </span>
                      )}
                      {field.action === 'viewDoc' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getNinDocUrl(selectedUser), `${selectedUser.applicant} - NIN Document`)}
                        >
                          View
                        </button>
                      )}
                      {field.action === 'viewAgentCert' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getAgentCertUrl(selectedUser), `${selectedUser.applicant} - Agent Certificate`)}
                        >
                          View
                        </button>
                      )}
                      {field.action === 'viewMembers' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => { setMembersModal(true); }}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isViewingDetails ? (
              <div className="flex justify-end">
                <div className={`px-4 py-2 rounded-lg font-medium ${getVerificationStatus().bgColor} ${getVerificationStatus().color}`}>
                  Status: {getVerificationStatus().text}
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleApproveUser(selectedUser)}
                  type="button"
                  className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify user
                </button>
                <button
                  onClick={() => { setRejectionModal(true); setVerificationModal(false); }}
                  type="button"
                  className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject user
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Corporate Verification Modal
  const renderCorporateVerificationModal = () => {
    if (!verificationModal || !selectedUser || !(selectedUser.userType === 'Corporate' || selectedUser.userType === 'corporate')) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
            <button
              onClick={() => { setVerificationModal(false); setIsViewingDetails(false); }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Company Name", value: selectedUser.applicant },
                  { label: "Registration Number", value: selectedUser.regNo || selectedUser.businessRegistrationNumber || "N/A" },
                  { label: "Company Email address", value: selectedUser.companyEmail || "N/A" },
                  { label: "Business Phone number", value: selectedUser.businessPhone || "N/A" },
                  { label: "Business Sector", value: selectedUser.businessSector || "N/A" },
                  { label: "Company Address", value: selectedUser.businessAddress || "N/A" },
                  { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || "N/A", action: 'verifyNin' },
                  { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
                  { label: "Signatory", value: `${getMembersList(selectedUser).length} members`, action: 'viewMembers' },
                  { label: "User Type", value: selectedUser.userType },
                  { label: "Application Date", value: formatGenerationDate(selectedUser.date) },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between items-center gap-4">
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-3">
                      <p className="text-zinc-900">{field.value}</p>
                      {field.action === 'verifyNin' && !isNinVerified(selectedUser) && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={handleOpenNinVerify}
                        >
                          Verify NIN
                        </button>
                      )}
                      {field.action === 'verifyNin' && isNinVerified(selectedUser) && (
                        <span className="text-green-600 font-medium">
                          ✓ Verified
                        </span>
                      )}
                      {field.action === 'viewDoc' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getNinDocUrl(selectedUser), `${selectedUser.applicant} - NIN Document`)}
                        >
                          View
                        </button>
                      )}
                      {field.action === 'viewAgentCert' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getAgentCertUrl(selectedUser), `${selectedUser.applicant} - Agent Certificate`)}
                        >
                          View
                        </button>
                      )}
                      {field.action === 'viewMembers' && getMembersList(selectedUser).length > 0 && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => { setMembersModal(true); setVerificationModal(false); }}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isViewingDetails ? (
              <div className="flex justify-end">
                <div className={`px-4 py-2 rounded-lg font-medium ${getVerificationStatus().bgColor} ${getVerificationStatus().color}`}>
                  Status: {getVerificationStatus().text}
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleApproveUser(selectedUser)}
                  type="button"
                  className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify user
                </button>
                <button
                  onClick={() => { setRejectionModal(true); setVerificationModal(false); }}
                  type="button"
                  className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject user
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Corporate Members Modal
  const renderCorporateMembersModal = () => {
    if (!membersModal || !selectedUser) {
      return null;
    }

    return (
      <div className='fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out'>
        <div className='bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
          <div className="flex justify-between items-center mb-8">
            <div className='flex items-center gap-3'>
              <span className='relative group text-zinc-500 hover:text-green-700 cursor-pointer inline-flex' onClick={() => { setMembersModal(false); setVerificationModal(true); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors duration-200"
                >
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute left -top-5 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-green-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Back
                </span>
              </span>
              <h3 className="text-2xl font-semibold text-zinc-800">Signatories</h3>
            </div>
            <button
              onClick={() => setMembersModal(false)}
              className="text-zinc-600 hover:text-red-800"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className=''>
            {getMembersList(selectedUser).length === 0 ? (
              <p className="text-zinc-500">No members provided.</p>
            ) : (
              <ul className="space-y-4">
                {getMembersList(selectedUser).map((member, idx) => {
                  const label = typeof member === 'string'
                    ? member
                    : (member?.name || member?.fullName || `Member ${idx + 1}`);
                  return (
                    <li key={idx} className="bg-zinc-100 p-4">
                      <div className="flex items-start justify-between">
                        <div className='flex w-full justify-between'>
                          <p className="text-zinc-900"><span className=" mr-2">{idx + 1}.</span> {label}</p>
                          <button className='text-green-700' onClick={() => { setSelectedMember(member); setUserDetail(true); }}>View</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  // User Detail Modal
  const renderUserDetailModal = () => {
    if (!userDetail || !selectedMember) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">Member Details</h3>
            <button
              onClick={() => { setUserDetail(false); setSelectedMember(null); }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Name", value: selectedMember.name },
                  { label: "Email", value: selectedMember.email },
                  { label: "Phone number", value: selectedMember.phoneNumber },
                  { label: "Nationality", value: selectedMember.nationality },
                  { label: "Gender", value: selectedMember.gender },
                  { label: "Job title", value: selectedMember.jobTitle },
                  { label: "NIN", value: selectedMember.nin, action: 'verifyNin' },
                  { label: "NIN Document", value: selectedMember.ninDoc, action: 'viewDoc' },
                  { label: "Address", value: selectedMember.address },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between items-center gap-4">
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-3">
                      <p className="text-zinc-900">{field.value}</p>
                      {field.action === 'verifyNin' && !isNinVerified(selectedMember) && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={handleOpenNinVerify}
                        >
                          Verify NIN
                        </button>
                      )}
                      {field.action === 'verifyNin' && isNinVerified(selectedMember) && (
                        <span className="text-green-600 font-medium">
                          ✓ Verified
                        </span>
                      )}
                      {field.action === 'viewDoc' && (
                        <button
                          type="button"
                          className="text-green-700 hover:underline"
                          onClick={() => handleOpenDocViewer(getNinDocUrl(selectedMember), `${selectedMember.name} - NIN Document`)}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rejection Modal
  const renderRejectionModal = () => {
    if (!rejectionModal || !selectedUser) {
      return null;
    }

    return (
      <div className='fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out'>
        <div className='bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">Reject KYC</h3>
            <button
              onClick={() => setRejectionModal(false)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className='my-15 space-y-3'>
            <p>Give reason</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto"; // reset first
                e.target.style.height = `${e.target.scrollHeight}px`; // grow with content
              }}
              type="text"
              placeholder='Reason for rejecting KYC'
              className='w-full min-h-auto  p-5 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 resize-none overflow-hidden'
            />
          </div>

          <div className='flex justify-end'>
            <button
              onClick={HandleRejectModal}
              type="button"
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Send to Applicant
            </button>
          </div>
        </div>
      </div>
    );
  };
  // NIN Verification Modal
  const renderNinVerifyModal = () => {
    if (!isNinVerifyOpen || !selectedUser) {
      return null;
    }

    const applicantName = selectedMember ? selectedMember.name : (selectedUser.applicant || selectedUser.name || 'Applicant');
    const ninNumber = selectedMember ? selectedMember.nin : (selectedUser.NinNo || selectedUser.nin || selectedUser.idNumber || 'N/A');

    return (
      <div className='fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out'>
        <div className='bg-white rounded-2xl shadow-xl px-8 py-10 w-full max-w-lg max-h-[90vh] overflow-y-auto'>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-zinc-800">Verify NIN</h3>
            <button
              onClick={handleCloseNinVerify}
              className="text-zinc-400 hover:text-zinc-600 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8 space-y-4">
            <p className="text-zinc-600 text-sm">
              Are you sure you want to verify the NIN for <span className="font-semibold text-zinc-800">{applicantName}</span>?
            </p>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">NIN Number</p>
              <p className="text-lg font-mono font-semibold text-zinc-800 tracking-widest">{ninNumber}</p>
            </div>
            <p className="text-xs text-zinc-400">
              This action will mark the applicant's identity verification status as verified in the system.
            </p>
          </div>

          <div className='flex justify-end gap-3'>
            <button
              onClick={handleCloseNinVerify}
              type="button"
              className="px-5 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyNin}
              type="button"
              className="px-5 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-sm"
            >
              Confirm Verification
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderResidentVerificationModal()}
      {renderFacilityManagerVerificationModal()}
      {renderAgentVerificationModal()}
      {renderCorporateVerificationModal()}
      {renderCorporateMembersModal()}
      {renderUserDetailModal()}
      {renderRejectionModal()}
      {renderNinVerifyModal()}

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={isDocViewerOpen}
        onClose={handleCloseDocViewer}
        documentUrl={currentDocument?.url}
        documentName={currentDocument?.name}
        documentType={currentDocument?.type}
      />
    </>
  );
};

export default ActorModals;
