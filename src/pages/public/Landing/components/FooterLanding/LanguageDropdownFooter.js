import React, { useState } from "react";
import { Dropdown, Space } from "antd";
import footerIcons from "../../../../../assets/icons/footer/index";

const languageOptions = [
  { key: "0", label: "EN" },
  { key: "1", label: "ES" },
  { key: "2", label: "FR" },
  { key: "3", label: "DE" },
];
const LanguageDropdownFooter = () => {
  const [language, setLanguage] = useState("EN");

  const handleMenuClick = (e) => {
    const selectedOption = languageOptions.find(
      (option) => option.key === e.key
    );
    if (selectedOption) {
      setLanguage(selectedOption.label);
    }
  };

  return (
    <Dropdown
      menu={{
        items: languageOptions,
        onClick: handleMenuClick,
      }}
      trigger={["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <div className="landing-footer-dropItem">{footerIcons.global}</div>
          {language}
          <div className="landing-footer-dropItem">{footerIcons.arrowDown}</div>
        </Space>
      </a>
    </Dropdown>
  );
};

export default LanguageDropdownFooter;
