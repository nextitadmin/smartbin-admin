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
    const cleanUrl = url.split('?')[0];
    const extension = cleanUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    return 'pdf';
  };

  const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (typeof formatGenerationDate === 'function') {
      const res = formatGenerationDate(val);
      if (res && res !== 'Invalid Date' && res !== 'N/A') return res;
    }
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) return 'N/A';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    } catch {
      return 'N/A';
    }
  };

  const getApplicantName = (user) => {
    if (!user) return 'N/A';
    if (user.applicant && user.applicant !== 'N/A') return user.applicant;
    if (user.fullName) return user.fullName;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    if (user.userId) {
      const name = `${user.userId.firstName || ''} ${user.userId.lastName || ''}`.trim();
      if (name) return name;
    }
    if (user.name) return user.name;
    if (user.companyName) return user.companyName;
    if (user.agencyName) return user.agencyName;
    if (user.facilityName) return user.facilityName;
    return 'N/A';
  };

  const getUserEmail = (user) => {
    if (!user) return 'N/A';
    if (user.email && user.email !== 'N/A') return user.email;
    if (user.userId?.email) return user.userId.email;
    if (user.userEmail) return user.userEmail;
    if (user.businessEmail) return user.businessEmail;
    if (user.companyEmail) return user.companyEmail;
    return 'N/A';
  };

  const getUserPhone = (user) => {
    if (!user) return 'N/A';
    if (user.phoneNumber && user.phoneNumber !== 'N/A') return user.phoneNumber;
    if (user.phone) return user.phone;
    if (user.userId?.phoneNumber) return user.userId.phoneNumber;
    if (user.userId?.phone) return user.userId.phone;
    if (user.businessPhone) return user.businessPhone;
    return 'N/A';
  };

  const formatLga = (lga) => {
    if (!lga) return 'N/A';
    if (typeof lga === 'object') {
      const name = lga.name || '';
      const state = lga.state || '';
      if (name && state) return `${name}, ${state}`;
      return name || state || 'N/A';
    }
    return String(lga);
  };

  const checkNinVerified = (user) => {
    if (!user) return false;
    if (typeof isNinVerified === 'function' && isNinVerified(user)) return true;
    return (
      user.ninVerified === true ||
      user.ninVerificationProviderStatus === 'verified' ||
      user.identityVerificationStatus === 'verified'
    );
  };

  const resolveNinDocUrl = (user) => {
    if (!user) return '';
    if (typeof getNinDocUrl === 'function') {
      const url = getNinDocUrl(user);
      if (url) return url;
    }
    const val = user.idDocument || user.ninDoc || user.documentUrl;
    if (!val) return '';
    if (/^https?:\/\//i.test(val)) return val;
    return `/images/${val}`;
  };

  const resolveAgentCertUrl = (user) => {
    if (!user) return '';
    if (typeof getAgentCertUrl === 'function') {
      const url = getAgentCertUrl(user);
      if (url) return url;
    }
    const val = user.AgentCertificate || user.agentCertificate;
    if (!val) return '';
    if (/^https?:\/\//i.test(val)) return val;
    return `/images/${val}`;
  };

  const resolveMembersList = (user) => {
    if (!user) return [];
    if (typeof getMembersList === 'function') {
      const list = getMembersList(user);
      if (Array.isArray(list)) return list;
    }
    const arrays = [user.members, user.signatories, user.signatoryList];
    const found = arrays.find((arr) => Array.isArray(arr));
    return Array.isArray(found) ? found : [];
  };

  const resolveVerificationStatus = () => {
    if (typeof getVerificationStatus === 'function') {
      const status = getVerificationStatus();
      if (status && status.text) {
        return {
          text: status.text,
          color: status.color || 'text-zinc-700',
          bgColor: status.bgColor || 'bg-zinc-100 border border-zinc-200'
        };
      }
    }
    const tab = activeTab || selectedUser?.status || 'pending';
    switch (tab) {
      case 'approved':
      case 'verified':
        return { text: 'Verified', color: 'text-green-700', bgColor: 'bg-green-50 border border-green-200' };
      case 'rejected':
        return { text: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-50 border border-red-200' };
      default:
        return { text: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border border-yellow-200' };
    }
  };

  // Reusable Field Rendering Component
  const renderFieldRows = (fields) => {
    const applicantName = getApplicantName(selectedUser);
    const docOwnerTitle = applicantName !== 'N/A' ? applicantName : (selectedUser?.userType || 'User');

    return (
      <div className="grid grid-cols-1 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="flex justify-between items-center gap-4">
            <label className="block text-sm font-medium text-zinc-600 mb-1">
              {field.label}
            </label>
            <div className="flex items-center gap-3">
              <p className="text-zinc-900">{field.value}</p>

              {field.action === 'verifyNin' && !checkNinVerified(selectedUser) && (
                <button
                  type="button"
                  className="text-green-700 hover:underline text-sm font-medium"
                  onClick={handleOpenNinVerify}
                >
                  Verify NIN
                </button>
              )}

              {field.action === 'verifyNin' && checkNinVerified(selectedUser) && (
                <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                  <span>✓</span> Verified
                </span>
              )}

              {field.action === 'viewDoc' && (
                resolveNinDocUrl(selectedUser) ? (
                  <button
                    type="button"
                    className="text-green-700 hover:underline text-sm font-medium"
                    onClick={() => handleOpenDocViewer(resolveNinDocUrl(selectedUser), `${docOwnerTitle} - NIN Document`)}
                  >
                    View
                  </button>
                ) : (
                  <span className="text-zinc-400 text-xs">No doc</span>
                )
              )}

              {field.action === 'viewAgentCert' && (
                resolveAgentCertUrl(selectedUser) ? (
                  <button
                    type="button"
                    className="text-green-700 hover:underline text-sm font-medium"
                    onClick={() => handleOpenDocViewer(resolveAgentCertUrl(selectedUser), `${docOwnerTitle} - Agent Certificate`)}
                  >
                    View
                  </button>
                ) : (
                  <span className="text-zinc-400 text-xs">No cert</span>
                )
              )}

              {field.action === 'viewMembers' && resolveMembersList(selectedUser).length > 0 && (
                <button
                  type="button"
                  className="text-green-700 hover:underline text-sm font-medium"
                  onClick={() => { setMembersModal(true); setVerificationModal(false); }}
                >
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Reusable Modal Footer
  const renderModalFooter = () => {
    const status = resolveVerificationStatus();

    if (isViewingDetails) {
      return (
        <div className="flex justify-end">
          <div className={`px-4 py-2 rounded-lg font-medium ${status.bgColor} ${status.color}`}>
            Status: {status.text}
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => handleApproveUser(selectedUser)}
          type="button"
          className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
        >
          Verify user
        </button>
        <button
          onClick={() => { setRejectionModal(true); setVerificationModal(false); }}
          type="button"
          className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          Reject user
        </button>
      </div>
    );
  };

  // Rejection Reason Banner
  const renderRejectionBanner = () => {
    if (!selectedUser?.rejectionReason) return null;
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-6">
        <p className="font-semibold mb-1">Rejection Reason:</p>
        <p>{selectedUser.rejectionReason}</p>
      </div>
    );
  };

  // Resident Verification Modal
  const renderResidentVerificationModal = () => {
    if (!verificationModal || !selectedUser) return null;

    const userType = selectedUser.userType?.toLowerCase();
    if (userType !== 'resident') return null;

    const residentFields = [
      { label: "Name", value: getApplicantName(selectedUser) },
      { label: "Email", value: getUserEmail(selectedUser) },
      { label: "Phone number", value: getUserPhone(selectedUser) },
      { label: "Nationality", value: selectedUser.nationality || selectedUser.userId?.nationality || "N/A" },
      { label: "Gender", value: selectedUser.gender || selectedUser.userId?.gender || "N/A" },
      { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || selectedUser.LAWMACustomerType || "N/A" },
      { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || selectedUser.ninNo || selectedUser.idNumber || "N/A", action: 'verifyNin' },
      { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
      ...(selectedUser.ninVerificationReference ? [{ label: "NIN Verification Ref", value: selectedUser.ninVerificationReference }] : []),
      { label: "Building type", value: selectedUser.buildingType || "N/A" },
      { label: "House number", value: selectedUser.houseNumber || selectedUser.houseNo || "N/A" },
      { label: "Flat number", value: selectedUser.flatNumber || selectedUser.flatNo || "N/A" },
      { label: "LGA", value: formatLga(selectedUser.lga) },
      { label: "Closest landmark", value: selectedUser.closestLandmark || selectedUser.ClosestLandmark || "N/A" },
      { label: "Address", value: selectedUser.address || "N/A" },
      { label: "User Type", value: selectedUser.userType || "Resident" },
      { label: "Application Date", value: formatDate(selectedUser.date || selectedUser.createdAt) },
      ...(selectedUser.identityVerificationStatus ? [{ label: "Identity Verification Status", value: capitalize(selectedUser.identityVerificationStatus) }] : []),
      ...(selectedUser.addressVerificationStatus ? [{ label: "Address Verification Status", value: capitalize(selectedUser.addressVerificationStatus) }] : []),
    ];

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
            {renderRejectionBanner()}
            {renderFieldRows(residentFields)}
            {renderModalFooter()}
          </div>
        </div>
      </div>
    );
  };

  // Facility Manager / Facility Verification Modal
  const renderFacilityManagerVerificationModal = () => {
    if (!verificationModal || !selectedUser) return null;

    const userType = selectedUser.userType?.toLowerCase();
    const isFacility = [
      'facility manager',
      'facility_manager',
      'facilitymanager',
      'facility'
    ].includes(userType);

    if (!isFacility) return null;

    const membersList = resolveMembersList(selectedUser);

    const facilityFields = [
      { label: "Name", value: getApplicantName(selectedUser) },
      { label: "Email", value: getUserEmail(selectedUser) },
      { label: "Phone number", value: getUserPhone(selectedUser) },
      { label: "Nationality", value: selectedUser.nationality || selectedUser.userId?.nationality || "N/A" },
      { label: "Gender", value: selectedUser.gender || selectedUser.userId?.gender || "N/A" },
      { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || selectedUser.LAWMACustomerType || "N/A" },
      { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || selectedUser.ninNo || selectedUser.idNumber || "N/A", action: 'verifyNin' },
      { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
      ...(selectedUser.ninVerificationReference ? [{ label: "NIN Verification Ref", value: selectedUser.ninVerificationReference }] : []),
      { label: "Building type", value: selectedUser.buildingType || "N/A" },
      { label: "House number", value: selectedUser.houseNumber || selectedUser.houseNo || "N/A" },
      { label: "Flat number", value: selectedUser.flatNumber || selectedUser.flatNo || "N/A" },
      { label: "LGA", value: formatLga(selectedUser.lga) },
      { label: "Closest landmark", value: selectedUser.closestLandmark || selectedUser.ClosestLandmark || "N/A" },
      { label: "Address", value: selectedUser.address || "N/A" },
      { label: "User Type", value: selectedUser.userType || "Facility" },
      { label: "Application Date", value: formatDate(selectedUser.date || selectedUser.createdAt) },
      ...(selectedUser.identityVerificationStatus ? [{ label: "Identity Verification Status", value: capitalize(selectedUser.identityVerificationStatus) }] : []),
      ...(selectedUser.addressVerificationStatus ? [{ label: "Address Verification Status", value: capitalize(selectedUser.addressVerificationStatus) }] : []),
      ...(membersList.length > 0 ? [{ label: "Signatories", value: `${membersList.length} members`, action: 'viewMembers' }] : []),
      ...(selectedUser.branches && selectedUser.branches.length > 0 ? [{ label: "Branches", value: `${selectedUser.branches.length} branches` }] : []),
    ];

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
            {renderRejectionBanner()}
            {renderFieldRows(facilityFields)}
            {renderModalFooter()}
          </div>
        </div>
      </div>
    );
  };

  // Agent Verification Modal
  const renderAgentVerificationModal = () => {
    if (!verificationModal || !selectedUser) return null;

    const userType = selectedUser.userType?.toLowerCase();
    const isAgent = ['agent', 'field agent', 'field_agent'].includes(userType);

    if (!isAgent) return null;

    const agentFields = [
      { label: "Name", value: getApplicantName(selectedUser) },
      { label: "Email", value: getUserEmail(selectedUser) },
      { label: "Phone Number", value: getUserPhone(selectedUser) },
      { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || selectedUser.LAWMACustomerType || "N/A" },
      { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || selectedUser.ninNo || selectedUser.idNumber || "N/A", action: 'verifyNin' },
      { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
      ...(selectedUser.ninVerificationReference ? [{ label: "NIN Verification Ref", value: selectedUser.ninVerificationReference }] : []),
      { label: "Agency Name", value: selectedUser.agencyName || selectedUser.businessName || "N/A" },
      { label: "Registration Number", value: selectedUser.RegNo || selectedUser.regNo || selectedUser.businessRegistrationNumber || "N/A" },
      { label: "Business Email address", value: selectedUser.businessEmail || "N/A" },
      { label: "Business Phone number", value: selectedUser.businessPhone || "N/A" },
      { label: "Branch Name", value: selectedUser.Branch || selectedUser.branch || selectedUser.branchName || "N/A" },
      { label: "Branch Address", value: selectedUser.Branchaddress || selectedUser.branchAddress || "N/A" },
      { label: "LGA", value: formatLga(selectedUser.lga) },
      { label: "Agent Registration Certificate", value: (selectedUser.AgentCertificate || selectedUser.agentCertificate) ? "Certificate uploaded" : "N/A", action: 'viewAgentCert' },
      { label: "User Type", value: selectedUser.userType || "Agent" },
      { label: "Application Date", value: formatDate(selectedUser.date || selectedUser.createdAt) },
      ...(selectedUser.agencyInformationStatus ? [{ label: "Agency Verification Status", value: capitalize(selectedUser.agencyInformationStatus) }] : []),
    ];

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
            {renderRejectionBanner()}
            {renderFieldRows(agentFields)}
            {renderModalFooter()}
          </div>
        </div>
      </div>
    );
  };

  // Corporate Verification Modal
  const renderCorporateVerificationModal = () => {
    if (!verificationModal || !selectedUser) return null;

    const userType = selectedUser.userType?.toLowerCase();
    const isCorporate = ['corporate', 'corporate customer', 'corporate_user'].includes(userType);

    if (!isCorporate) return null;

    const membersList = resolveMembersList(selectedUser);

    const corporateFields = [
      { label: "Company Name", value: getApplicantName(selectedUser) },
      { label: "Registration Number", value: selectedUser.regNo || selectedUser.RegNo || selectedUser.businessRegistrationNumber || selectedUser.rcNumber || "N/A" },
      { label: "Company Email address", value: selectedUser.companyEmail || getUserEmail(selectedUser) },
      { label: "Business Phone number", value: selectedUser.businessPhone || getUserPhone(selectedUser) },
      { label: "Business Sector", value: selectedUser.businessSector || selectedUser.sector || "N/A" },
      { label: "Company Address", value: selectedUser.businessAddress || selectedUser.companyAddress || selectedUser.address || "N/A" },
      { label: "LGA", value: formatLga(selectedUser.lga) },
      { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || selectedUser.ninNo || selectedUser.idNumber || "N/A", action: 'verifyNin' },
      { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
      ...(selectedUser.ninVerificationReference ? [{ label: "NIN Verification Ref", value: selectedUser.ninVerificationReference }] : []),
      { label: "Signatory", value: `${membersList.length} members`, action: 'viewMembers' },
      { label: "User Type", value: selectedUser.userType || "Corporate" },
      { label: "Application Date", value: formatDate(selectedUser.date || selectedUser.createdAt) },
      ...(selectedUser.signatoryVerificationStatus ? [{ label: "Signatory Verification Status", value: capitalize(selectedUser.signatoryVerificationStatus) }] : []),
    ];

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
            {renderRejectionBanner()}
            {renderFieldRows(corporateFields)}
            {renderModalFooter()}
          </div>
        </div>
      </div>
    );
  };

  // Fallback Generic Verification Modal (for any other or unanticipated userType)
  const renderFallbackVerificationModal = () => {
    if (!verificationModal || !selectedUser) return null;

    const userType = selectedUser.userType?.toLowerCase();
    const isHandled = [
      'resident',
      'facility manager',
      'facility_manager',
      'facilitymanager',
      'facility',
      'agent',
      'field agent',
      'field_agent',
      'corporate',
      'corporate customer',
      'corporate_user'
    ].includes(userType);

    if (isHandled) return null;

    const membersList = resolveMembersList(selectedUser);

    const genericFields = [
      { label: "Name", value: getApplicantName(selectedUser) },
      { label: "Email", value: getUserEmail(selectedUser) },
      { label: "Phone number", value: getUserPhone(selectedUser) },
      { label: "Nationality", value: selectedUser.nationality || selectedUser.userId?.nationality || "N/A" },
      { label: "Gender", value: selectedUser.gender || selectedUser.userId?.gender || "N/A" },
      { label: "LAWMA Customer type", value: selectedUser.lawmaCustomerType || selectedUser.LAWMACustomerType || "N/A" },
      { label: "NIN", value: selectedUser.NinNo || selectedUser.nin || selectedUser.ninNo || selectedUser.idNumber || "N/A", action: 'verifyNin' },
      { label: "NIN Document", value: (selectedUser.idDocument || selectedUser.ninDoc) ? "Document uploaded" : "N/A", action: 'viewDoc' },
      ...(selectedUser.ninVerificationReference ? [{ label: "NIN Verification Ref", value: selectedUser.ninVerificationReference }] : []),
      { label: "Building type", value: selectedUser.buildingType || "N/A" },
      { label: "House number", value: selectedUser.houseNumber || selectedUser.houseNo || "N/A" },
      { label: "Flat number", value: selectedUser.flatNumber || selectedUser.flatNo || "N/A" },
      { label: "LGA", value: formatLga(selectedUser.lga) },
      { label: "Closest landmark", value: selectedUser.closestLandmark || selectedUser.ClosestLandmark || "N/A" },
      { label: "Address", value: selectedUser.address || "N/A" },
      { label: "User Type", value: selectedUser.userType || "N/A" },
      { label: "Application Date", value: formatDate(selectedUser.date || selectedUser.createdAt) },
      ...(membersList.length > 0 ? [{ label: "Signatories", value: `${membersList.length} members`, action: 'viewMembers' }] : []),
    ];

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800">
              {selectedUser.userType ? `${selectedUser.userType} Details` : 'User Details'}
            </h3>
            <button
              onClick={() => { setVerificationModal(false); setIsViewingDetails(false); }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {renderRejectionBanner()}
            {renderFieldRows(genericFields)}
            {renderModalFooter()}
          </div>
        </div>
      </div>
    );
  };

  // Corporate Members / Signatories Modal
  const renderCorporateMembersModal = () => {
    if (!membersModal || !selectedUser) {
      return null;
    }

    const members = resolveMembersList(selectedUser);

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
                <span className="absolute left-0 -top-5 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-green-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
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
          <div>
            {members.length === 0 ? (
              <p className="text-zinc-500">No members or signatories provided.</p>
            ) : (
              <ul className="space-y-4">
                {members.map((member, idx) => {
                  const label = typeof member === 'string'
                    ? member
                    : (member?.name || member?.fullName || `${member?.firstName || ''} ${member?.lastName || ''}`.trim() || `Member ${idx + 1}`);
                  return (
                    <li key={idx} className="bg-zinc-100 p-4 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className='flex w-full justify-between items-center'>
                          <p className="text-zinc-900 font-medium"><span className="mr-2 text-zinc-500">{idx + 1}.</span> {label}</p>
                          <button className='text-green-700 hover:underline text-sm font-medium' onClick={() => { setSelectedMember(member); setUserDetail(true); }}>View</button>
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

  // User / Member Detail Modal
  const renderUserDetailModal = () => {
    if (!userDetail || !selectedMember) {
      return null;
    }

    const memberName = selectedMember.name || selectedMember.fullName || `${selectedMember.firstName || ''} ${selectedMember.lastName || ''}`.trim() || "Member";

    const memberFields = [
      { label: "Name", value: memberName },
      { label: "Email", value: selectedMember.email || "N/A" },
      { label: "Phone number", value: selectedMember.phoneNumber || selectedMember.phone || "N/A" },
      { label: "Nationality", value: selectedMember.nationality || "N/A" },
      { label: "Gender", value: selectedMember.gender || "N/A" },
      { label: "Job title", value: selectedMember.jobTitle || selectedMember.role || "N/A" },
      { label: "NIN", value: selectedMember.nin || selectedMember.NinNo || "N/A", action: 'verifyNin' },
      { label: "NIN Document", value: (selectedMember.ninDoc || selectedMember.idDocument) ? "Document uploaded" : "N/A", action: 'viewDoc' },
      { label: "Address", value: selectedMember.address || "N/A" },
    ];

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
            <div className="grid grid-cols-1 gap-4">
              {memberFields.map((field) => (
                <div key={field.label} className="flex justify-between items-center gap-4">
                  <label className="block text-sm font-medium text-zinc-600 mb-1">
                    {field.label}
                  </label>
                  <div className="flex items-center gap-3">
                    <p className="text-zinc-900">{field.value}</p>
                    {field.action === 'verifyNin' && !checkNinVerified(selectedMember) && (
                      <button
                        type="button"
                        className="text-green-700 hover:underline text-sm font-medium"
                        onClick={handleOpenNinVerify}
                      >
                        Verify NIN
                      </button>
                    )}
                    {field.action === 'verifyNin' && checkNinVerified(selectedMember) && (
                      <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                        <span>✓</span> Verified
                      </span>
                    )}
                    {field.action === 'viewDoc' && (
                      resolveNinDocUrl(selectedMember) ? (
                        <button
                          type="button"
                          className="text-green-700 hover:underline text-sm font-medium"
                          onClick={() => handleOpenDocViewer(resolveNinDocUrl(selectedMember), `${memberName} - NIN Document`)}
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-zinc-400 text-xs">No doc</span>
                      )
                    )}
                  </div>
                </div>
              ))}
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
            <p className="text-sm font-medium text-zinc-700">Give reason</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              rows={3}
              placeholder='Reason for rejecting KYC'
              className='w-full min-h-[100px] p-5 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 resize-none'
            />
          </div>

          <div className='flex justify-end'>
            <button
              onClick={HandleRejectModal}
              type="button"
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
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

    const applicantName = selectedMember
      ? (selectedMember.name || selectedMember.fullName || 'Member')
      : (getApplicantName(selectedUser) !== 'N/A'
          ? getApplicantName(selectedUser)
          : (selectedUser.userType ? `${selectedUser.userType} Applicant` : 'Applicant'));
    const ninNumber = selectedMember
      ? (selectedMember.nin || selectedMember.NinNo || 'N/A')
      : (selectedUser.NinNo || selectedUser.nin || selectedUser.ninNo || selectedUser.idNumber || 'N/A');

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
      {renderFallbackVerificationModal()}
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
