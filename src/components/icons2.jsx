

// Dashboard Icons
export const ChevronDownIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    );
};

export const FilterIcon = (props) => {
    const { className = "h-5 w-5 mr-2", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-6.586l-3.707-3.707A1 1 0 019 7V4a1 1 0 01-1-1H4z" />
        </svg>
    );
};

export const SearchIcon = (props) => {
    const { className = "h-5 w-5 text-zinc-400", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
};

export const ExportIcon = (props) => {
    const { className = "h-5 w-5 ml-2", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
        </svg>
    );
};

export const DotsVerticalIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
    );
};

export const ChevronLeftIcon = (props) => {
    const { className = "h-6 w-6", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    );
};

export const ChevronRightIcon = (props) => {
    const { className = "h-6 w-6", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
};

export const SortIcon = (props) => {
    const { direction, className = "h-4 w-4 ml-1", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            {direction === 'asc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            ) : direction === 'desc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
                </>
            )}
        </svg>
    );
};

// Revenue Icons
export const ArrowUpIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
    );
};

export const ArrowDownIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
    );
};

// Smartbin Overview Icons
export const RequestIcon = (props) => {
    const { className = "h-8 w-8 text-green-600", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
};

export const DeliveredIcon = (props) => {
    const { className = "h-8 w-8 text-green-600", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
};

// Sidebar Icons
export const DashboardIcon = (props) => {
    const { active, className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...restProps} className={`${className} ${active ? 'text-white' : 'text-zinc-500'}`}>
            <path d="M18.3333 9.3234V3.65674C18.3333 2.40674 17.8 1.90674 16.475 1.90674H13.1083C11.7833 1.90674 11.25 2.40674 11.25 3.65674V9.3234C11.25 10.5734 11.7833 11.0734 13.1083 11.0734H16.475C17.8 11.0734 18.3333 10.5734 18.3333 9.3234Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.3333 16.8237V15.3237C18.3333 14.0737 17.8 13.5737 16.475 13.5737H13.1083C11.7833 13.5737 11.25 14.0737 11.25 15.3237V16.8237C11.25 18.0737 11.7833 18.5737 13.1083 18.5737H16.475C17.8 18.5737 18.3333 18.0737 18.3333 16.8237Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.75002 11.1567V16.8234C8.75002 18.0734 8.21669 18.5734 6.89169 18.5734H3.52502C2.20002 18.5734 1.66669 18.0734 1.66669 16.8234V11.1567C1.66669 9.90674 2.20002 9.40674 3.52502 9.40674H6.89169C8.21669 9.40674 8.75002 9.90674 8.75002 11.1567Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.75002 3.65674V5.15674C8.75002 6.40674 8.21669 6.90674 6.89169 6.90674H3.52502C2.20002 6.90674 1.66669 6.40674 1.66669 5.15674V3.65674C1.66669 2.40674 2.20002 1.90674 3.52502 1.90674H6.89169C8.21669 1.90674 8.75002 2.40674 8.75002 3.65674Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const UsersIcon = (props) => {
    const { active, className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...restProps} className={`${className} ${active ? 'text-white' : 'text-zinc-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
};

export const CompaniesIcon = (props) => {
    const { active, className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...restProps} className={`${className} ${active ? 'text-white' : 'text-zinc-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );
};

export const SmartbinIcon = (props) => {
    const { active, className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...restProps} className={`${className} ${active ? 'text-white' : 'text-zinc-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );
};

export const SettingsIcon = (props) => {
    const { active, className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...restProps} className={`${className} ${active ? 'text-white' : 'text-zinc-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
};

export const LogoutIcon = (props) => {
    const { className = "h-5 w-5 text-zinc-500", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
};

export const MenuIcon = (props) => {
    const { className = "h-6 w-6 text-zinc-500", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
};

export const CloseIcon = (props) => {
    const { className = "h-6 w-6 text-zinc-500", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
};

// Reports Page Icons
export const PlusIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
};

export const MagnifyingGlassIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    );
};

export const ChevronUpDownIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
    );
};

export const XMarkIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
};

export const CheckCircleIconSolid = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} {...restProps}>
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.001-5.497Z" clipRule="evenodd" />
        </svg>
    );
};

export const ExclamationTriangleIconSolid = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} {...restProps}>
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
    );
};

export const LoadingSpinnerIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} animate-spin`} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
};

export const CheckIcon = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={className}
            {...restProps}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
    );
};

// Additional icons from provided list
export const EllipsisVerticalIcon = DotsVerticalIcon;

export const CheckCircleIconOutline = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
};

export const ExclamationTriangleIconOutline = (props) => {
    const { className = "h-5 w-5", ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
    );
};

export const DocumentIcon = (props) => (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="currentColor">
            <path d="M16 22.75H8c-3.65 0-5.75-2.1-5.75-5.75v-10C2.25 3.35 4.35 1.25 8 1.25h8c3.65 0 5.75 2.1 5.75 5.75v10c0 3.65-2.1 5.75-5.75 5.75zm-8-20C5.14 2.75 3.75 4.14 3.75 7v10c0 2.86 1.39 4.25 4.25 4.25h8c2.86 0 4.25-1.39 4.25-4.25v-10c0-2.86-1.39-4.25-4.25-4.25z" />
            <path d="M18.5 9.25h-2c-1.52 0-2.75-1.23-2.75-2.75v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .69.56 1.25 1.25 1.25h2c.41 0 .75.34.75.75s-.34.75-.75.75z" />
            <path d="M12 13.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75z" />
            <path d="M16 17.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75z" />
        </g>
    </svg>
);

export const WasteIcon = (props) => (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#044B94" fillOpacity="0.0" d="M3 6h18M5 6v14c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2V6M8 6V4c0-1.10457.89543-2 2-2h4c1.1046 0 2 .89543 2 2v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
);

export const ReportIcon = (props) => (
    <svg width="18" height="9" viewBox="0 0 18 9" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.0917 0.315346C17.0142 0.237239 16.9221 0.175244 16.8205 0.132937C16.719 0.0906297 16.61 0.0688477 16.5 0.0688477C16.39 0.0688477 16.2811 0.0906297 16.1795 0.132937C16.078 0.175244 15.9858 0.237239 15.9084 0.315346L10.6667 5.56535L7.0917 1.98201C7.01423 1.90391 6.92206 1.84191 6.82051 1.7996C6.71896 1.7573 6.61004 1.73551 6.50003 1.73551C6.39002 1.73551 6.2811 1.7573 6.17955 1.7996C6.078 1.84191 5.98583 1.90391 5.90836 1.98201L0.908364 6.98201C0.830257 7.05948 0.768262 7.15165 0.725954 7.2532C0.683647 7.35475 0.661865 7.46367 0.661865 7.57368C0.661865 7.68369 0.683647 7.79261 0.725954 7.89416C0.768262 7.99571 0.830257 8.08788 0.908364 8.16535C0.985833 8.24345 1.078 8.30545 1.17955 8.34776C1.2811 8.39006 1.39002 8.41184 1.50003 8.41184C1.61004 8.41184 1.71896 8.39006 1.82051 8.34776C1.92206 8.30545 2.01423 8.24345 2.0917 8.16535L6.50003 3.74868L10.075 7.33201C10.1525 7.41012 10.2447 7.47211 10.3462 7.51442C10.4478 7.55673 10.5567 7.57851 10.6667 7.57851C10.7767 7.57851 10.8856 7.55673 10.9872 7.51442C11.0887 7.47211 11.1809 7.41012 11.2584 7.33201L17.0917 1.49868C17.1698 1.42121 17.2318 1.32904 17.2741 1.22749C17.3164 1.12594 17.3382 1.01702 17.3382 0.907013C17.3382 0.797003 17.3164 0.688082 17.2741 0.586532C17.2318 0.484983 17.1698 0.392815 17.0917 0.315346Z" fill="currentColor" />
    </svg>
);

export const TeamsIcon = (props) => (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M7.63411 9.29889C7.55078 9.29056 7.45078 9.29056 7.35911 9.29889C5.37578 9.23223 3.80078 7.60723 3.80078 5.60723C3.80078 3.56556 5.45078 1.90723 7.50078 1.90723C9.54245 1.90723 11.2008 3.56556 11.2008 5.60723C11.1924 7.60723 9.61745 9.23223 7.63411 9.29889Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.6747 3.57324C15.2914 3.57324 16.5914 4.88158 16.5914 6.48991C16.5914 8.06491 15.3414 9.34824 13.7831 9.40658C13.7164 9.39824 13.6414 9.39824 13.5664 9.40658" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.46758 12.3732C1.45091 13.7232 1.45091 15.9232 3.46758 17.2649C5.75924 18.7982 9.51758 18.7982 11.8092 17.2649C13.8259 15.9149 13.8259 13.7149 11.8092 12.3732C9.52591 10.8482 5.76758 10.8482 3.46758 12.3732Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.2832 16.9072C15.8832 16.7822 16.4499 16.5406 16.9165 16.1822C18.2165 15.2072 18.2165 13.5989 16.9165 12.6239C16.4582 12.2739 15.8999 12.0406 15.3082 11.9072" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);