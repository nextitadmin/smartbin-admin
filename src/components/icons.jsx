// Dashboard Icons
export const ChevronDownIcon = (props) => {
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
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};

export const FilterIcon = (props) => {
  const { className = "h-5 w-5 mr-2", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-6.586l-3.707-3.707A1 1 0 019 7V4a1 1 0 01-1-1H4z"
      />
    </svg>
  );
};
export const ReceiptIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="32" height="32" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.29104 22.9859C9.22818 21.9802 10.6568 22.0602 11.4796 23.1573L12.6339 24.7002C13.5596 25.923 15.0568 25.923 15.9825 24.7002L17.1368 23.1573C17.9596 22.0602 19.3882 21.9802 20.3253 22.9859C22.3596 25.1573 24.0168 24.4373 24.0168 21.3973V8.51732C24.0282 3.91161 22.9539 2.75732 18.6339 2.75732H9.9939C5.6739 2.75732 4.59961 3.91161 4.59961 8.51732V21.3859C4.59961 24.4373 6.26818 25.1459 8.29104 22.9859Z" fill="white" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.85226 13.0429H9.86253H9.85226Z" fill="white" />
      <path d="M9.85226 13.0429H9.86253" stroke="#007836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M13.0547 13.043H19.3404" stroke="#007836" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.85226 8.47158H9.86253H9.85226Z" fill="white" />
      <path d="M9.85226 8.47158H9.86253" stroke="#007836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M13.0547 8.47144H19.3404" stroke="#007836" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export const ReceiptTextIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="32" height="32" viewBox="0 0 40 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 29.88V22.5H27V28.14L31.88 30.96L30.38 33.56L24 29.88ZM33 3.5L30 0.5L27 3.5L24 0.5L21 3.5L18 0.5L15 3.5L12 0.5L9 3.5L6 0.5L3 3.5L0 0.5V40.5L3 37.5L6 40.5L9 37.5L12 40.5L15.16 37.34C15.44 37.72 15.76 38.06 16.1 38.4C18.7238 40.9846 22.2604 42.4314 25.9434 42.4269C29.6265 42.4223 33.1595 40.9668 35.7769 38.3757C38.3943 35.7845 39.8855 32.2664 39.9272 28.5836C39.969 24.9008 38.558 21.3498 36 18.7V0.5L33 3.5ZM16.2 18.5C15 19.64 14.06 21 13.34 22.5H6V18.5H16.2ZM12.14 26.5C12 27.16 12 27.82 12 28.5C12 29.18 12 29.84 12.14 30.5H6V26.5H12.14ZM30 14.5H6V10.5H30V14.5ZM35.7 28.5C35.7 29.78 35.46 31.04 35 32.22C34.48 33.38 33.76 34.5 32.86 35.36C32 36.26 30.88 36.98 29.72 37.5C28.54 37.96 27.28 38.2 26 38.2C20.64 38.2 16.3 33.86 16.3 28.5C16.3 25.92 17.32 23.5 19.14 21.64C21 19.82 23.42 18.8 26 18.8C31.34 18.8 35.7 23.14 35.7 28.5Z" fill="#007836" />
    </svg>

  );
};

export const PackageDeliveredIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="32" height="32" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0.5C5 0.5 4.2 0.9 3.6 1.7L1 4.9C0.4 5.7 0 6.5 0 7.5V32.5C0 34.7 1.8 36.5 4 36.5H20.6C20.2 35.3 20 33.9 20 32.5C20 25.9 25.4 20.5 32 20.5C33.4 20.5 34.8 20.7 36 21.1V7.5C36 6.5 35.6 5.7 35 4.9L32.2 1.5C31.8 0.9 31 0.5 30 0.5H6ZM5.8 2.5H29.8L31.6 4.5H4.2L5.8 2.5ZM6 24.5H18V30.5H6V24.5ZM36.6 26.1L29.4 33.3L26.2 30.1L24 32.5L29.6 38.5L39.2 28.9L36.6 26.1Z" fill="#007836" />
    </svg>

  );
};

export const SearchIcon = (props) => {
  const { className = "h-5 w-5 text-green-800", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
};

export const ExportIcon = (props) => {
  const { className = "h-5 w-5 ml-2", ...restProps } = props;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.64667 0.646227C6.74042 0.552593 6.8675 0.5 7 0.5C7.1325 0.5 7.25958 0.552593 7.35333 0.646227L10.3533 3.64623C10.4417 3.74101 10.4897 3.86637 10.4874 3.99591C10.4852 4.12544 10.4327 4.24903 10.3411 4.34064C10.2495 4.43225 10.1259 4.48472 9.99635 4.48701C9.86681 4.4893 9.74145 4.44121 9.64667 4.35289L7.5 2.20623V9.99956C7.5 10.1322 7.44732 10.2593 7.35355 10.3531C7.25979 10.4469 7.13261 10.4996 7 10.4996C6.86739 10.4996 6.74022 10.4469 6.64645 10.3531C6.55268 10.2593 6.5 10.1322 6.5 9.99956V2.20623L4.35333 4.35289C4.25855 4.44121 4.13319 4.4893 4.00365 4.48701C3.87412 4.48472 3.75053 4.43225 3.65892 4.34064C3.56731 4.24903 3.51484 4.12544 3.51255 3.99591C3.51026 3.86637 3.55835 3.74101 3.64667 3.64623L6.64667 0.646227ZM1 9.49956C1.13261 9.49956 1.25979 9.55224 1.35355 9.64601C1.44732 9.73978 1.5 9.86695 1.5 9.99956V11.4996C1.5 11.7648 1.60536 12.0191 1.79289 12.2067C1.98043 12.3942 2.23478 12.4996 2.5 12.4996H11.5C11.7652 12.4996 12.0196 12.3942 12.2071 12.2067C12.3946 12.0191 12.5 11.7648 12.5 11.4996V9.99956C12.5 9.86695 12.5527 9.73978 12.6464 9.64601C12.7402 9.55224 12.8674 9.49956 13 9.49956C13.1326 9.49956 13.2598 9.55224 13.3536 9.64601C13.4473 9.73978 13.5 9.86695 13.5 9.99956V11.4996C13.5 12.03 13.2893 12.5387 12.9142 12.9138C12.5391 13.2888 12.0304 13.4996 11.5 13.4996H2.5C1.96957 13.4996 1.46086 13.2888 1.08579 12.9138C0.710714 12.5387 0.5 12.03 0.5 11.4996V9.99956C0.5 9.86695 0.552678 9.73978 0.646447 9.64601C0.740215 9.55224 0.867392 9.49956 1 9.49956Z"
        fill="white"
      />
    </svg>
  );
};

export const DotsVerticalIcon = (props) => {
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
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    </svg>
  );
};

export const ChevronLeftIcon = (props) => {
  const { className = "h-6 w-6", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

export const ArrowLeftIcon = (props) => {
  const { className = "h-6 w-6", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
  );
};

export const ChevronRightIcon = (props) => {
  const { className = "h-6 w-6", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
};

export const SortIcon = (props) => {
  const { direction, className = "h-4 w-4 ml-1", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      {direction === "asc" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      ) : direction === "desc" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 9l7 7 7-7"
          />
        </>
      )}
    </svg>
  );
};

// Revenue Icons
export const ArrowUpIcon = (props) => {
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
        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
      />
    </svg>
  );
};

export const ArrowDownIcon = (props) => {
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
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  );
};

// Smartbin Overview Icons
export const RequestIcon = (props) => {
  const { className = "h-8 w-8 text-white", ...restProps } = props;
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.41017 18.7624C7.19113 17.9243 8.3816 17.991 9.06732 18.9053L10.0292 20.191C10.8007 21.21 12.0483 21.21 12.8197 20.191L13.7816 18.9053C14.4673 17.991 15.6578 17.9243 16.4387 18.7624C18.134 20.5719 19.5149 19.9719 19.5149 17.4386V6.70527C19.5245 2.86718 18.6292 1.90527 15.0292 1.90527H7.82922C4.22922 1.90527 3.33398 2.86718 3.33398 6.70527V17.4291C3.33398 19.9719 4.72446 20.5624 6.41017 18.7624Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.71119 10.4762H7.71975H7.71119Z"
        fill="white"
      />
      <path
        d="M7.71119 10.4762H7.71975"
        stroke="#007836"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.3789 10.4766H15.617"
        stroke="#007836"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.71119 6.66662H7.71975H7.71119Z"
        fill="white"
      />
      <path
        d="M7.71119 6.66662H7.71975"
        stroke="#007836"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.3789 6.66699H15.617"
        stroke="#007836"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const DeliveredIcon = (props) => {
  const { className = "h-8 w-8 text-green-600", ...restProps } = props;
  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 0C4.16667 0 3.5 0.333333 3 1L0.833333 3.66667C0.333333 4.33333 0 5 0 5.83333V26.6667C0 28.5 1.5 30 3.33333 30H17.1667C16.8333 29 16.6667 27.8333 16.6667 26.6667C16.6667 21.1667 21.1667 16.6667 26.6667 16.6667C27.8333 16.6667 29 16.8333 30 17.1667V5.83333C30 5 29.6667 4.33333 29.1667 3.66667L26.8333 0.833333C26.5 0.333333 25.8333 0 25 0H5ZM4.83333 1.66667H24.8333L26.3333 3.33333H3.5L4.83333 1.66667ZM5 20H15V25H5V20ZM30.5 21.3333L24.5 27.3333L21.8333 24.6667L20 26.6667L24.6667 31.6667L32.6667 23.6667L30.5 21.3333Z"
        fill="#007836"
      />
    </svg>
  );
};

// Sidebar Icons
export const DashboardIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        d="M18.3333 9.3234V3.65674C18.3333 2.40674 17.8 1.90674 16.475 1.90674H13.1083C11.7833 1.90674 11.25 2.40674 11.25 3.65674V9.3234C11.25 10.5734 11.7833 11.0734 13.1083 11.0734H16.475C17.8 11.0734 18.3333 10.5734 18.3333 9.3234Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 16.8237V15.3237C18.3333 14.0737 17.8 13.5737 16.475 13.5737H13.1083C11.7833 13.5737 11.25 14.0737 11.25 15.3237V16.8237C11.25 18.0737 11.7833 18.5737 13.1083 18.5737H16.475C17.8 18.5737 18.3333 18.0737 18.3333 16.8237Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75002 11.1567V16.8234C8.75002 18.0734 8.21669 18.5734 6.89169 18.5734H3.52502C2.20002 18.5734 1.66669 18.0734 1.66669 16.8234V11.1567C1.66669 9.90674 2.20002 9.40674 3.52502 9.40674H6.89169C8.21669 9.40674 8.75002 9.90674 8.75002 11.1567Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75002 3.65674V5.15674C8.75002 6.40674 8.21669 6.90674 6.89169 6.90674H3.52502C2.20002 6.90674 1.66669 6.40674 1.66669 5.15674V3.65674C1.66669 2.40674 2.20002 1.90674 3.52502 1.90674H6.89169C8.21669 1.90674 8.75002 2.40674 8.75002 3.65674Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UsersIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
};

export const CompaniesIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
};

export const SmartbinIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
};

export const SettingsIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

export const LogoutIcon = (props) => {
  const { className = "h-5 w-5 text-green-700", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
};

export const MenuIcon = (props) => {
  const { className = "h-6 w-6 text-green-700", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
};

export const CloseIcon = (props) => {
  const { className = "h-6 w-6 text-green-700", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Reports Page Icons
export const PlusIcon = (props) => {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export const MagnifyingGlassIcon = (props) => {
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
};

export const ChevronUpDownIcon = (props) => {
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
        d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

export const XMarkIcon = (props) => {
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};

export const CheckCircleIconSolid = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      {...restProps}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.001-5.497Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ExclamationTriangleIconSolid = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      {...restProps}
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const LoadingSpinnerIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${className} animate-spin`}
      {...restProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};

export const ExclamationTriangleIconOutline = (props) => {
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
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  );
};
export const WalletIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.4677 13.9777C18.0477 14.3877 17.8077 14.9777 17.8677 15.6077C17.9577 16.6877 18.9477 17.4777 20.0277 17.4777H21.9277V18.6677C21.9277 20.7377 20.2377 22.4277 18.1677 22.4277H6.68773C4.61773 22.4277 2.92773 20.7377 2.92773 18.6677V11.9377C2.92773 9.86774 4.61773 8.17773 6.68773 8.17773H18.1677C20.2377 8.17773 21.9277 9.86774 21.9277 11.9377V13.3777H19.9077C19.3477 13.3777 18.8377 13.5977 18.4677 13.9777Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2.92773 12.838V8.26808C2.92773 7.07808 3.65773 6.01804 4.76773 5.59804L12.7077 2.59804C13.9477 2.12804 15.2777 3.04807 15.2777 4.37807V8.17806" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M22.9865 14.3979V16.4579C22.9865 17.0079 22.5465 17.4579 21.9865 17.4779H20.0265C18.9465 17.4779 17.9565 16.6879 17.8665 15.6079C17.8065 14.9779 18.0465 14.3879 18.4665 13.9779C18.8365 13.5979 19.3465 13.3779 19.9065 13.3779H21.9865C22.5465 13.3979 22.9865 13.8479 22.9865 14.3979Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7.42773 12.4277H14.4277" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};
export const ShopIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.51172 9.34985V13.0915C2.51172 16.8332 4.01172 18.3332 7.75338 18.3332H12.2451C15.9867 18.3332 17.4867 16.8332 17.4867 13.0915V9.34985" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.99779 10.0003C11.5228 10.0003 12.6478 8.75866 12.4978 7.23366L11.9478 1.66699H8.05613L7.49779 7.23366C7.34779 8.75866 8.47279 10.0003 9.99779 10.0003Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M15.2557 10.0003C16.9391 10.0003 18.1724 8.63366 18.0057 6.95866L17.7724 4.66699C17.4724 2.50033 16.6391 1.66699 14.4557 1.66699H11.9141L12.4974 7.50866C12.6391 8.88366 13.8807 10.0003 15.2557 10.0003Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4.69478 10.0003C6.06978 10.0003 7.31144 8.88366 7.44477 7.50866L7.62811 5.66699L8.02811 1.66699H5.48644C3.30311 1.66699 2.46978 2.50033 2.16978 4.66699L1.94478 6.95866C1.77811 8.63366 3.01144 10.0003 4.69478 10.0003Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.0052 14.167C8.61354 14.167 7.92188 14.8587 7.92188 16.2503V18.3337H12.0885V16.2503C12.0885 14.8587 11.3969 14.167 10.0052 14.167Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  )
};
export const ShoppingCartIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.67188 1.66699H3.12188C4.02188 1.66699 4.73021 2.44199 4.65521 3.33366L3.96354 11.6337C3.84688 12.992 4.92187 14.1586 6.28854 14.1586H15.1635C16.3635 14.1586 17.4135 13.1753 17.5052 11.9837L17.9552 5.73366C18.0552 4.35033 17.0052 3.22532 15.6135 3.22532H4.85522" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13.5417 18.3333C14.117 18.3333 14.5833 17.867 14.5833 17.2917C14.5833 16.7164 14.117 16.25 13.5417 16.25C12.9664 16.25 12.5 16.7164 12.5 17.2917C12.5 17.867 12.9664 18.3333 13.5417 18.3333Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.86979 18.3333C7.44509 18.3333 7.91146 17.867 7.91146 17.2917C7.91146 16.7164 7.44509 16.25 6.86979 16.25C6.29449 16.25 5.82812 16.7164 5.82812 17.2917C5.82812 17.867 6.29449 18.3333 6.86979 18.3333Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7.5 6.66699H17.5" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  );
};
export const TwoUsersIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 34.5001V38.5001H4V34.5001C4 34.5001 4 26.5001 18 26.5001C32 26.5001 32 34.5001 32 34.5001ZM25 15.5001C25 14.1156 24.5895 12.7622 23.8203 11.6111C23.0511 10.4599 21.9579 9.56273 20.6788 9.03292C19.3997 8.5031 17.9922 8.36448 16.6344 8.63458C15.2765 8.90467 14.0292 9.57136 13.0503 10.5503C12.0713 11.5293 11.4046 12.7766 11.1345 14.1344C10.8644 15.4923 11.003 16.8998 11.5328 18.1789C12.0627 19.4579 12.9599 20.5512 14.111 21.3204C15.2622 22.0895 16.6155 22.5001 18 22.5001C19.8565 22.5001 21.637 21.7626 22.9497 20.4498C24.2625 19.1371 25 17.3566 25 15.5001ZM31.88 26.5001C33.1095 27.4516 34.1155 28.6609 34.8274 30.0431C35.5392 31.4252 35.9394 32.9466 36 34.5001V38.5001H44V34.5001C44 34.5001 44 27.2401 31.88 26.5001ZM30 8.50007C28.6236 8.49367 27.2776 8.90514 26.14 9.68007C27.3549 11.3775 28.0081 13.4126 28.0081 15.5001C28.0081 17.5875 27.3549 19.6226 26.14 21.3201C27.2776 22.095 28.6236 22.5065 30 22.5001C31.8565 22.5001 33.637 21.7626 34.9497 20.4498C36.2625 19.1371 37 17.3566 37 15.5001C37 13.6436 36.2625 11.8631 34.9497 10.5503C33.637 9.23757 31.8565 8.50007 30 8.50007Z" fill="#007836" />
    </svg>
  );
};
export const OrderIcon = (props) => {
  const { className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.2832 12.3994L19.9998 20.9161L34.6165 12.4494" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M20 36.0161V20.8994" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M36.0157 21.3831V15.283C36.0157 12.983 34.3657 10.183 32.3491 9.06638L23.4491 4.13301C21.5491 3.06634 18.4491 3.06634 16.5491 4.13301L7.64906 9.06638C5.63239 10.183 3.98242 12.983 3.98242 15.283V24.7164C3.98242 27.0164 5.63239 29.8164 7.64906 30.933L16.5491 35.8664C17.4991 36.3997 18.7491 36.6664 19.9991 36.6664C21.2491 36.6664 22.4991 36.3997 23.4491 35.8664" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M31.9994 35.6667C34.9449 35.6667 37.3327 33.2789 37.3327 30.3334C37.3327 27.3878 34.9449 25 31.9994 25C29.0539 25 26.666 27.3878 26.666 30.3334C26.666 33.2789 29.0539 35.6667 31.9994 35.6667Z" stroke="#007836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M38.3327 36.6667L36.666 35" stroke="#007836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  );
};

export const DocumentIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
      {...restProps}
    >
      <g fill="currentColor">
        <path d="M16 22.75H8c-3.65 0-5.75-2.1-5.75-5.75v-10C2.25 3.35 4.35 1.25 8 1.25h8c3.65 0 5.75 2.1 5.75 5.75v10c0 3.65-2.1 5.75-5.75 5.75zm-8-20C5.14 2.75 3.75 4.14 3.75 7v10c0 2.86 1.39 4.25 4.25 4.25h8c2.86 0 4.25-1.39 4.25-4.25v-10c0-2.86-1.39-4.25-4.25-4.25z" />
        <path d="M18.5 9.25h-2c-1.52 0-2.75-1.23-2.75-2.75v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .69.56 1.25 1.25 1.25h2c.41 0 .75.34.75.75s-.34.75-.75.75z" />
        <path d="M12 13.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75z" />
        <path d="M16 17.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75z" />
      </g>
    </svg>
  );
};
export const UserEditIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (


    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} ${active ? "text-white" : "text-green-700"}`}
      {...restProps}>
      <path d="M10.4961 10.7397C12.9123 10.7397 14.8711 8.78099 14.8711 6.36475C14.8711 3.9485 12.9123 1.98975 10.4961 1.98975C8.07985 1.98975 6.12109 3.9485 6.12109 6.36475C6.12109 8.78099 8.07985 10.7397 10.4961 10.7397Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.8077 14.0131L13.7102 17.1107C13.5877 17.2332 13.4739 17.4606 13.4477 17.6269L13.2814 18.8081C13.2202 19.2369 13.5177 19.5344 13.9464 19.4731L15.1277 19.3069C15.2939 19.2806 15.5302 19.1669 15.6439 19.0444L18.7414 15.9469C19.2752 15.4131 19.5289 14.7919 18.7414 14.0044C17.9627 13.2256 17.3415 13.4794 16.8077 14.0131Z" stroke="#007836" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.3672 14.4585C16.6297 15.4035 17.3647 16.1385 18.3097 16.401" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2.98828 19.4902C2.98828 16.104 6.35705 13.3652 10.5046 13.3652C11.4146 13.3652 12.2895 13.4965 13.1033 13.7415" stroke="#007836" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  );
};
export const CartIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (


    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} ${active ? "text-white" : "text-green-700"}`}
      {...restProps}>
      <path d="M1.67188 1.90625H3.12188C4.02188 1.90625 4.73021 2.68125 4.65521 3.57292L3.96354 11.8729C3.84688 13.2312 4.92187 14.3979 6.28854 14.3979H15.1635C16.3635 14.3979 17.4135 13.4146 17.5052 12.2229L17.9552 5.97292C18.0552 4.58959 17.0052 3.46458 15.6135 3.46458H4.85522" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M13.5417 18.5733C14.117 18.5733 14.5833 18.107 14.5833 17.5317C14.5833 16.9564 14.117 16.49 13.5417 16.49C12.9664 16.49 12.5 16.9564 12.5 17.5317C12.5 18.107 12.9664 18.5733 13.5417 18.5733Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.86979 18.5733C7.44509 18.5733 7.91146 18.107 7.91146 17.5317C7.91146 16.9564 7.44509 16.49 6.86979 16.49C6.29449 16.49 5.82812 16.9564 5.82812 17.5317C5.82812 18.107 6.29449 18.5733 6.86979 18.5733Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7.5 6.90625H17.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


  );
};

export const WasteIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
      {...restProps}
    >
      <path
        fill="#044B94"
        fillOpacity="0.0"
        d="M3 6h18M5 6v14c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2V6M8 6V4c0-1.10457.89543-2 2-2h4c1.1046 0 2 .89543 2 2v2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const UserIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        d="M16.6673 17.74V16.0733C16.6673 15.1893 16.3161 14.3414 15.691 13.7163C15.0659 13.0912 14.218 12.74 13.334 12.74H6.66732C5.78326 12.74 4.93542 13.0912 4.31029 13.7163C3.68517 14.3414 3.33398 15.1893 3.33398 16.0733V17.74"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99935 9.40666C11.8403 9.40666 13.3327 7.91427 13.3327 6.07332C13.3327 4.23237 11.8403 2.73999 9.99935 2.73999C8.1584 2.73999 6.66602 4.23237 6.66602 6.07332C6.66602 7.91427 8.1584 9.40666 9.99935 9.40666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const VerifyIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        d="M6.98242 10.2401L8.99076 12.2567L13.0158 8.22339"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.95742 2.28159C9.53242 1.78993 10.4741 1.78993 11.0574 2.28159L12.3741 3.41493C12.6241 3.63159 13.0908 3.80659 13.4241 3.80659H14.8408C15.7241 3.80659 16.4491 4.53159 16.4491 5.41492V6.83159C16.4491 7.15659 16.6241 7.63159 16.8408 7.88159L17.9741 9.19826C18.4658 9.77326 18.4658 10.7149 17.9741 11.2983L16.8408 12.6149C16.6241 12.8649 16.4491 13.3316 16.4491 13.6649V15.0816C16.4491 15.9649 15.7241 16.6899 14.8408 16.6899H13.4241C13.0991 16.6899 12.6241 16.8649 12.3741 17.0816L11.0574 18.2149C10.4824 18.7066 9.54075 18.7066 8.95742 18.2149L7.64076 17.0816C7.39076 16.8649 6.92409 16.6899 6.59075 16.6899H5.14909C4.26575 16.6899 3.54076 15.9649 3.54076 15.0816V13.6566C3.54076 13.3316 3.36576 12.8649 3.15742 12.6149L2.03242 11.2899C1.54909 10.7149 1.54909 9.78159 2.03242 9.20659L3.15742 7.88159C3.36576 7.63159 3.54076 7.16492 3.54076 6.83992V5.40659C3.54076 4.52326 4.26575 3.79826 5.14909 3.79826H6.59075C6.91575 3.79826 7.39076 3.62326 7.64076 3.40659L8.95742 2.28159Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const OutstandingIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (

    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"  {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}>
      <path d="M24.3984 0.399902C27.0199 0.401854 29.6132 0.940601 32.0185 1.98294C34.4238 3.02529 36.5902 4.54914 38.3841 6.46061C40.1781 8.37208 41.5616 10.6307 42.4494 13.0972C43.3373 15.5637 43.7106 18.1859 43.5465 20.8022C43.3823 23.4185 42.6841 25.9735 41.4949 28.3097C40.3058 30.6459 38.6508 32.7138 36.632 34.3861C34.6132 36.0583 32.2733 37.2994 29.7566 38.0329C27.2398 38.7665 24.5996 38.9768 21.9984 38.6511V26.7999C21.9984 24.8903 21.2399 23.059 19.8896 21.7087C18.5393 20.3585 16.708 19.5999 14.7984 19.5999H5.19844C5.19844 14.5077 7.22129 9.62415 10.822 6.02345C14.4227 2.42275 19.3063 0.399902 24.3984 0.399902ZM23.1984 7.5999C22.8802 7.5999 22.575 7.72633 22.3499 7.95137C22.1249 8.17642 21.9984 8.48164 21.9984 8.7999V20.7999L22.0176 21.0159C22.0682 21.2922 22.2141 21.542 22.4298 21.7218C22.6456 21.9016 22.9176 22 23.1984 21.9999H30.3984L30.6144 21.9807C30.9095 21.9273 31.1739 21.7653 31.3555 21.5267C31.5371 21.2881 31.6228 20.9901 31.5957 20.6915C31.5686 20.3928 31.4307 20.1152 31.2091 19.9131C30.9875 19.7111 30.6983 19.5994 30.3984 19.5999H24.3984V8.7999L24.3792 8.5839C24.3287 8.30763 24.1828 8.05784 23.9671 7.87804C23.7513 7.69823 23.4793 7.59981 23.1984 7.5999ZM0.398438 26.7999C0.398438 25.5269 0.90415 24.306 1.80433 23.4058C2.7045 22.5056 3.9254 21.9999 5.19844 21.9999H14.7984C16.0715 21.9999 17.2924 22.5056 18.1926 23.4058C19.0927 24.306 19.5984 25.5269 19.5984 26.7999V38.7999C19.5984 40.0729 19.0927 41.2938 18.1926 42.194C17.2924 43.0942 16.0715 43.5999 14.7984 43.5999H5.19844C3.9254 43.5999 2.7045 43.0942 1.80433 42.194C0.90415 41.2938 0.398438 40.0729 0.398438 38.7999V26.7999ZM13.5984 26.7999H6.39844C6.08018 26.7999 5.77495 26.9263 5.54991 27.1514C5.32487 27.3764 5.19844 27.6816 5.19844 27.9999C5.19844 28.3182 5.32487 28.6234 5.54991 28.8484C5.77495 29.0735 6.08018 29.1999 6.39844 29.1999H13.5984C13.9167 29.1999 14.2219 29.0735 14.447 28.8484C14.672 28.6234 14.7984 28.3182 14.7984 27.9999C14.7984 27.6816 14.672 27.3764 14.447 27.1514C14.2219 26.9263 13.9167 26.7999 13.5984 26.7999ZM13.5984 31.5999H6.39844C6.08018 31.5999 5.77495 31.7263 5.54991 31.9514C5.32487 32.1764 5.19844 32.4816 5.19844 32.7999C5.19844 33.1182 5.32487 33.4234 5.54991 33.6484C5.77495 33.8735 6.08018 33.9999 6.39844 33.9999H13.5984C13.9167 33.9999 14.2219 33.8735 14.447 33.6484C14.672 33.4234 14.7984 33.1182 14.7984 32.7999C14.7984 32.4816 14.672 32.1764 14.447 31.9514C14.2219 31.7263 13.9167 31.5999 13.5984 31.5999ZM13.5984 36.3999H6.39844C6.08018 36.3999 5.77495 36.5263 5.54991 36.7514C5.32487 36.9764 5.19844 37.2816 5.19844 37.5999C5.19844 37.9182 5.32487 38.2234 5.54991 38.4484C5.77495 38.6735 6.08018 38.7999 6.39844 38.7999H13.5984C13.9167 38.7999 14.2219 38.6735 14.447 38.4484C14.672 38.2234 14.7984 37.9182 14.7984 37.5999C14.7984 37.2816 14.672 36.9764 14.447 36.7514C14.2219 36.5263 13.9167 36.3999 13.5984 36.3999Z" fill="currentColor" />
    </svg>

  );
};
export const RecieptIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (

    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"  {...restProps}
    className={`${className} ${active ? "text-white" : "text-green-700"}`}>
    <path d="M8.29299 23.4854C9.23013 22.4797 10.6587 22.5597 11.4816 23.6568L12.6358 25.1997C13.5616 26.4226 15.0587 26.4226 15.9844 25.1997L17.1387 23.6568C17.9616 22.5597 19.3901 22.4797 20.3273 23.4854C22.3616 25.6568 24.0187 24.9368 24.0187 21.8968V9.01684C24.0301 4.41112 22.9558 3.25684 18.6358 3.25684H9.99585C5.67585 3.25684 4.60156 4.41112 4.60156 9.01684V21.8854C4.60156 24.9368 6.27013 25.6454 8.29299 23.4854Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.85421 13.5426H9.86448H9.85421Z" fill="white"/>
    <path d="M9.85421 13.5426H9.86448" stroke="#007836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.0547 13.5425H19.3404" stroke="#007836" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.85421 8.97133H9.86448H9.85421Z" fill="white"/>
    <path d="M9.85421 8.97133H9.86448" stroke="#007836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.0547 8.97119H19.3404" stroke="#007836" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    

  );
};
export const VerifyFillIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (

    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"  {...restProps}
    className={`${className} ${active ? "text-white" : "text-green-700"}`}>
<path fill-rule="evenodd" clip-rule="evenodd" d="M25.6991 9.40485C25.4693 9.03758 25.1306 8.75111 24.7303 8.58532C24.33 8.41953 23.888 8.38266 23.4658 8.47985L20.4691 9.16819C20.162 9.23877 19.8429 9.23877 19.5358 9.16819L16.5391 8.47985C16.1169 8.38266 15.6749 8.41953 15.2746 8.58532C14.8743 8.75111 14.5356 9.03758 14.3058 9.40485L12.6724 12.0115C12.5058 12.2782 12.2808 12.5032 12.0141 12.6715L9.40745 14.3049C9.04081 14.5345 8.75476 14.8726 8.589 15.2722C8.42325 15.6718 8.38601 16.1131 8.48245 16.5349L9.17078 19.5349C9.24111 19.8414 9.24111 20.1599 9.17078 20.4665L8.48245 23.4649C8.38563 23.8868 8.42269 24.3285 8.58846 24.7284C8.75423 25.1284 9.04049 25.4668 9.40745 25.6965L12.0141 27.3299C12.2808 27.4965 12.5058 27.7215 12.6741 27.9882L14.3074 30.5949C14.7774 31.3465 15.6741 31.7182 16.5391 31.5199L19.5358 30.8315C19.8429 30.7609 20.162 30.7609 20.4691 30.8315L23.4674 31.5199C23.8894 31.6167 24.3311 31.5796 24.731 31.4138C25.131 31.2481 25.4694 30.9618 25.6991 30.5949L27.3324 27.9882C27.4991 27.7215 27.7241 27.4965 27.9908 27.3299L30.5991 25.6965C30.9661 25.4664 31.2522 25.1277 31.4177 24.7274C31.5832 24.3271 31.6198 23.8852 31.5224 23.4632L30.8358 20.4665C30.7652 20.1594 30.7652 19.8403 30.8358 19.5332L31.5241 16.5349C31.6211 16.113 31.5843 15.6715 31.4188 15.2716C31.2534 14.8716 30.9674 14.5332 30.6008 14.3032L27.9924 12.6699C27.7262 12.5029 27.5011 12.2778 27.3341 12.0115L25.6991 9.40485ZM24.8608 16.2832C24.9639 16.0936 24.9894 15.8715 24.932 15.6635C24.8747 15.4555 24.7388 15.2778 24.5531 15.1679C24.3675 15.058 24.1464 15.0244 23.9364 15.0742C23.7265 15.124 23.544 15.2533 23.4274 15.4349L19.0691 22.8115L16.4374 20.2915C16.3594 20.2114 16.266 20.1477 16.1628 20.1045C16.0596 20.0612 15.9487 20.0391 15.8368 20.0396C15.7249 20.0401 15.6143 20.0631 15.5115 20.1073C15.4086 20.1515 15.3158 20.2159 15.2384 20.2967C15.161 20.3776 15.1008 20.4732 15.0611 20.5778C15.0215 20.6825 15.0034 20.794 15.0078 20.9059C15.0122 21.0177 15.0391 21.1274 15.0869 21.2286C15.1346 21.3298 15.2023 21.4204 15.2858 21.4949L18.6758 24.7432C18.7665 24.8299 18.8757 24.8951 18.9951 24.9337C19.1145 24.9724 19.2412 24.9836 19.3655 24.9664C19.4899 24.9493 19.6088 24.9042 19.7133 24.8347C19.8178 24.7652 19.9052 24.6729 19.9691 24.5649L24.8608 16.2832Z" fill="currentColor"/>
</svg>

    

  );
};

export const AuditIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2.23966C0 2.06285 0.0702379 1.89328 0.195262 1.76826C0.320286 1.64324 0.489856 1.573 0.666667 1.573H3.33333C3.51014 1.573 3.67971 1.64324 3.80474 1.76826C3.92976 1.89328 4 2.06285 4 2.23966C4 2.41648 3.92976 2.58605 3.80474 2.71107C3.67971 2.83609 3.51014 2.90633 3.33333 2.90633H0.666667C0.489856 2.90633 0.320286 2.83609 0.195262 2.71107C0.0702379 2.58605 0 2.41648 0 2.23966ZM5.33333 2.23966C5.33333 2.06285 5.40357 1.89328 5.5286 1.76826C5.65362 1.64324 5.82319 1.573 6 1.573H19.3333C19.5101 1.573 19.6797 1.64324 19.8047 1.76826C19.9298 1.89328 20 2.06285 20 2.23966C20 2.41648 19.9298 2.58605 19.8047 2.71107C19.6797 2.83609 19.5101 2.90633 19.3333 2.90633H6C5.82319 2.90633 5.65362 2.83609 5.5286 2.71107C5.40357 2.58605 5.33333 2.41648 5.33333 2.23966ZM5.33333 6.23967C5.33333 6.06285 5.40357 5.89328 5.5286 5.76826C5.65362 5.64324 5.82319 5.573 6 5.573H15.3333C15.5101 5.573 15.6797 5.64324 15.8047 5.76826C15.9298 5.89328 16 6.06285 16 6.23967C16 6.41648 15.9298 6.58604 15.8047 6.71107C15.6797 6.83609 15.5101 6.90633 15.3333 6.90633H6C5.82319 6.90633 5.65362 6.83609 5.5286 6.71107C5.40357 6.58604 5.33333 6.41648 5.33333 6.23967ZM0 10.2397C0 10.0629 0.0702379 9.89328 0.195262 9.76826C0.320286 9.64324 0.489856 9.573 0.666667 9.573H3.33333C3.51014 9.573 3.67971 9.64324 3.80474 9.76826C3.92976 9.89328 4 10.0629 4 10.2397C4 10.4165 3.92976 10.586 3.80474 10.7111C3.67971 10.8361 3.51014 10.9063 3.33333 10.9063H0.666667C0.489856 10.9063 0.320286 10.8361 0.195262 10.7111C0.0702379 10.586 0 10.4165 0 10.2397ZM5.33333 10.2397C5.33333 10.0629 5.40357 9.89328 5.5286 9.76826C5.65362 9.64324 5.82319 9.573 6 9.573H19.3333C19.5101 9.573 19.6797 9.64324 19.8047 9.76826C19.9298 9.89328 20 10.0629 20 10.2397C20 10.4165 19.9298 10.586 19.8047 10.7111C19.6797 10.8361 19.5101 10.9063 19.3333 10.9063H6C5.82319 10.9063 5.65362 10.8361 5.5286 10.7111C5.40357 10.586 5.33333 10.4165 5.33333 10.2397ZM5.33333 14.2397C5.33333 14.0629 5.40357 13.8933 5.5286 13.7683C5.65362 13.6432 5.82319 13.573 6 13.573H15.3333C15.5101 13.573 15.6797 13.6432 15.8047 13.7683C15.9298 13.8933 16 14.0629 16 14.2397C16 14.4165 15.9298 14.586 15.8047 14.7111C15.6797 14.8361 15.5101 14.9063 15.3333 14.9063H6C5.82319 14.9063 5.65362 14.8361 5.5286 14.7111C5.40357 14.586 5.33333 14.4165 5.33333 14.2397ZM0 18.2397C0 18.0629 0.0702379 17.8933 0.195262 17.7683C0.320286 17.6432 0.489856 17.573 0.666667 17.573H3.33333C3.51014 17.573 3.67971 17.6432 3.80474 17.7683C3.92976 17.8933 4 18.0629 4 18.2397C4 18.4165 3.92976 18.586 3.80474 18.7111C3.67971 18.8361 3.51014 18.9063 3.33333 18.9063H0.666667C0.489856 18.9063 0.320286 18.8361 0.195262 18.7111C0.0702379 18.586 0 18.4165 0 18.2397ZM5.33333 18.2397C5.33333 18.0629 5.40357 17.8933 5.5286 17.7683C5.65362 17.6432 5.82319 17.573 6 17.573H19.3333C19.5101 17.573 19.6797 17.6432 19.8047 17.7683C19.9298 17.8933 20 18.0629 20 18.2397C20 18.4165 19.9298 18.586 19.8047 18.7111C19.6797 18.8361 19.5101 18.9063 19.3333 18.9063H6C5.82319 18.9063 5.65362 18.8361 5.5286 18.7111C5.40357 18.586 5.33333 18.4165 5.33333 18.2397Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PSPIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <g clipPath="url(#clip0_4678_2253)">
        <path
          d="M5 5.86499C4.50555 5.86499 4.0222 5.71837 3.61107 5.44367C3.19995 5.16896 2.87952 4.77852 2.6903 4.3217C2.50108 3.86488 2.45157 3.36222 2.54804 2.87727C2.6445 2.39231 2.8826 1.94686 3.23223 1.59722C3.58186 1.24759 4.02732 1.00949 4.51227 0.913028C4.99723 0.816565 5.49989 0.866073 5.95671 1.05529C6.41352 1.24451 6.80397 1.56494 7.07867 1.97607C7.35338 2.38719 7.5 2.87054 7.5 3.36499C7.5 4.02803 7.23661 4.66392 6.76777 5.13276C6.29893 5.6016 5.66304 5.86499 5 5.86499ZM5 2.11499C4.75277 2.11499 4.5111 2.1883 4.30554 2.32565C4.09998 2.46301 3.93976 2.65823 3.84515 2.88664C3.75054 3.11504 3.72579 3.36638 3.77402 3.60885C3.82225 3.85133 3.9413 4.07406 4.11612 4.24887C4.29093 4.42369 4.51366 4.54274 4.75614 4.59097C4.99861 4.6392 5.24995 4.61445 5.47835 4.51984C5.70676 4.42523 5.90199 4.26502 6.03934 4.05945C6.17669 3.85389 6.25 3.61222 6.25 3.36499C6.25 3.03347 6.1183 2.71553 5.88388 2.48111C5.64946 2.24669 5.33152 2.11499 5 2.11499ZM15 5.86499C14.5055 5.86499 14.0222 5.71837 13.6111 5.44367C13.2 5.16896 12.8795 4.77852 12.6903 4.3217C12.5011 3.86488 12.4516 3.36222 12.548 2.87727C12.6445 2.39231 12.8826 1.94686 13.2322 1.59722C13.5819 1.24759 14.0273 1.00949 14.5123 0.913028C14.9972 0.816565 15.4999 0.866073 15.9567 1.05529C16.4135 1.24451 16.804 1.56494 17.0787 1.97607C17.3534 2.38719 17.5 2.87054 17.5 3.36499C17.5 4.02803 17.2366 4.66392 16.7678 5.13276C16.2989 5.6016 15.663 5.86499 15 5.86499ZM15 2.11499C14.7528 2.11499 14.5111 2.1883 14.3055 2.32565C14.1 2.46301 13.9398 2.65823 13.8451 2.88664C13.7505 3.11504 13.7258 3.36638 13.774 3.60885C13.8222 3.85133 13.9413 4.07406 14.1161 4.24887C14.2909 4.42369 14.5137 4.54274 14.7561 4.59097C14.9986 4.6392 15.2499 4.61445 15.4784 4.51984C15.7068 4.42523 15.902 4.26502 16.0393 4.05945C16.1767 3.85389 16.25 3.61222 16.25 3.36499C16.25 3.03347 16.1183 2.71553 15.8839 2.48111C15.6495 2.24669 15.3315 2.11499 15 2.11499ZM16.25 18.99H13.75C13.4185 18.99 13.1005 18.8583 12.8661 18.6239C12.6317 18.3895 12.5 18.0715 12.5 17.74V13.365H13.75V17.74H16.25V12.115H17.5V8.36499C17.5 8.19923 17.4342 8.04026 17.3169 7.92305C17.1997 7.80584 17.0408 7.73999 16.875 7.73999H12.8625L10 12.74L7.1375 7.73999H3.125C2.95924 7.73999 2.80027 7.80584 2.68306 7.92305C2.56585 8.04026 2.5 8.19923 2.5 8.36499V12.115H3.75V17.74H6.25V13.365H7.5V17.74C7.5 18.0715 7.3683 18.3895 7.13388 18.6239C6.89946 18.8583 6.58152 18.99 6.25 18.99H3.75C3.41848 18.99 3.10054 18.8583 2.86612 18.6239C2.6317 18.3895 2.5 18.0715 2.5 17.74V13.365C2.16848 13.365 1.85054 13.2333 1.61612 12.9989C1.3817 12.7645 1.25 12.4465 1.25 12.115V8.36499C1.25 7.86771 1.44754 7.3908 1.79917 7.03917C2.15081 6.68754 2.62772 6.48999 3.125 6.48999H7.8625L10 10.24L12.1375 6.48999H16.875C17.3723 6.48999 17.8492 6.68754 18.2008 7.03917C18.5525 7.3908 18.75 7.86771 18.75 8.36499V12.115C18.75 12.4465 18.6183 12.7645 18.3839 12.9989C18.1495 13.2333 17.8315 13.365 17.5 13.365V17.74C17.5 18.0715 17.3683 18.3895 17.1339 18.6239C16.8995 18.8583 16.5815 18.99 16.25 18.99Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_4678_2253">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0 0.23999)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const BinIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
    >
      <path
        d="M2.5 5.23999H4.16667H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8327 5.24007V16.9067C15.8327 17.3488 15.6571 17.7727 15.3445 18.0852C15.032 18.3978 14.608 18.5734 14.166 18.5734H5.83268C5.39065 18.5734 4.96673 18.3978 4.65417 18.0852C4.34161 17.7727 4.16602 17.3488 4.16602 16.9067V5.24007M6.66602 5.24007V3.5734C6.66602 3.13138 6.84161 2.70745 7.15417 2.39489C7.46673 2.08233 7.89065 1.90674 8.33268 1.90674H11.666C12.108 1.90674 12.532 2.08233 12.8445 2.39489C13.1571 2.70745 13.3327 3.13138 13.3327 3.5734V5.24007"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.63086 11.7825C8.2536 11.2638 9.03842 10.9797 9.84888 10.9797C10.6593 10.9797 11.4442 11.2638 12.0669 11.7825"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.6642C7.42074 9.85258 8.60595 9.40479 9.83333 9.40479C11.0607 9.40479 12.2459 9.85258 13.1667 10.6642"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.74414 12.9043C9.06399 12.677 9.44662 12.5549 9.83897 12.5549C10.2313 12.5549 10.614 12.677 10.9338 12.9043"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.83398 14.1299H9.83906"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TrashIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.85938 5.85742H4.52604H17.8594" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.1901 5.8575V17.5242C16.1901 17.9662 16.0145 18.3901 15.7019 18.7027C15.3894 19.0152 14.9655 19.1908 14.5234 19.1908H6.1901C5.74808 19.1908 5.32415 19.0152 5.01159 18.7027C4.69903 18.3901 4.52344 17.9662 4.52344 17.5242V5.8575M7.02344 5.8575V4.19084C7.02344 3.74881 7.19903 3.32489 7.51159 3.01233C7.82415 2.69976 8.24808 2.52417 8.6901 2.52417H12.0234C12.4655 2.52417 12.8894 2.69976 13.2019 3.01233C13.5145 3.32489 13.6901 3.74881 13.6901 4.19084V5.8575" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


  );
};

export const GarbageIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.85938 5.35742H4.52604H17.8594" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.1901 5.3575V17.0242C16.1901 17.4662 16.0145 17.8901 15.7019 18.2027C15.3894 18.5152 14.9655 18.6908 14.5234 18.6908H6.1901C5.74808 18.6908 5.32415 18.5152 5.01159 18.2027C4.69903 17.8901 4.52344 17.4662 4.52344 17.0242V5.3575M7.02344 5.3575V3.69084C7.02344 3.24881 7.19903 2.82489 7.51159 2.51233C7.82415 2.19976 8.24808 2.02417 8.6901 2.02417H12.0234C12.4655 2.02417 12.8894 2.19976 13.2019 2.51233C13.5145 2.82489 13.6901 3.24881 13.6901 3.69084V5.3575" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.69531 9.52417V14.5242" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12.0234 9.52417V14.5242" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
    </svg>



  );
};

export const ReportIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="18"
      height="9"
      viewBox="0 0 18 9"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
      {...restProps}
    >
      <path
        d="M17.0917 0.315346C17.0142 0.237239 16.9221 0.175244 16.8205 0.132937C16.719 0.0906297 16.61 0.0688477 16.5 0.0688477C16.39 0.0688477 16.2811 0.0906297 16.1795 0.132937C16.078 0.175244 15.9858 0.237239 15.9084 0.315346L10.6667 5.56535L7.0917 1.98201C7.01423 1.90391 6.92206 1.84191 6.82051 1.7996C6.71896 1.7573 6.61004 1.73551 6.50003 1.73551C6.39002 1.73551 6.2811 1.7573 6.17955 1.7996C6.078 1.84191 5.98583 1.90391 5.90836 1.98201L0.908364 6.98201C0.830257 7.05948 0.768262 7.15165 0.725954 7.2532C0.683647 7.35475 0.661865 7.46367 0.661865 7.57368C0.661865 7.68369 0.683647 7.79261 0.725954 7.89416C0.768262 7.99571 0.830257 8.08788 0.908364 8.16535C0.985833 8.24345 1.078 8.30545 1.17955 8.34776C1.2811 8.39006 1.39002 8.41184 1.50003 8.41184C1.61004 8.41184 1.71896 8.39006 1.82051 8.34776C1.92206 8.30545 2.01423 8.24345 2.0917 8.16535L6.50003 3.74868L10.075 7.33201C10.1525 7.41012 10.2447 7.47211 10.3462 7.51442C10.4478 7.55673 10.5567 7.57851 10.6667 7.57851C10.7767 7.57851 10.8856 7.55673 10.9872 7.51442C11.0887 7.47211 11.1809 7.41012 11.2584 7.33201L17.0917 1.49868C17.1698 1.42121 17.2318 1.32904 17.2741 1.22749C17.3164 1.12594 17.3382 1.01702 17.3382 0.907013C17.3382 0.797003 17.3164 0.688082 17.2741 0.586532C17.2318 0.484983 17.1698 0.392815 17.0917 0.315346Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const TeamsIcon = (props) => {
  const { active, className = "h-5 w-5", ...restProps } = props;
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${active ? "text-white" : "text-green-700"}`}
      {...restProps}
    >
      <path
        d="M7.63411 9.29889C7.55078 9.29056 7.45078 9.29056 7.35911 9.29889C5.37578 9.23223 3.80078 7.60723 3.80078 5.60723C3.80078 3.56556 5.45078 1.90723 7.50078 1.90723C9.54245 1.90723 11.2008 3.56556 11.2008 5.60723C11.1924 7.60723 9.61745 9.23223 7.63411 9.29889Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6747 3.57324C15.2914 3.57324 16.5914 4.88158 16.5914 6.48991C16.5914 8.06491 15.3414 9.34824 13.7831 9.40658C13.7164 9.39824 13.6414 9.39824 13.5664 9.40658"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.46758 12.3732C1.45091 13.7232 1.45091 15.9232 3.46758 17.2649C5.75924 18.7982 9.51758 18.7982 11.8092 17.2649C13.8259 15.9149 13.8259 13.7149 11.8092 12.3732C9.52591 10.8482 5.76758 10.8482 3.46758 12.3732Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2832 16.9072C15.8832 16.7822 16.4499 16.5406 16.9165 16.1822C18.2165 15.2072 18.2165 13.5989 16.9165 12.6239C16.4582 12.2739 15.8999 12.0406 15.3082 11.9072"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
