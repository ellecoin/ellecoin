import React from "react";
import { Typography, Row, Col, Image } from "antd";
import { useTranslation } from "react-i18next";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";

const { Title } = Typography;

const BrandSection = () => {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 992px)");

  const brands = [
    {
      src: "./images/about/forbes.png",
      link: "https://www.forbes.com/sites/serenitygibbons/2024/04/30/freelance-solutions-that-will-shape-tomorrows-market/?sh=13a65d601c33",
    },
    {
      src: "./images/about/tech.png",
      link: "https://techbullion.com/navigating-career-transitions-freelancing-solutions-and-tools/",
    },
    {
      src: "./images/about/msn.png",
      link: "https://www.msn.com/en-us/news/other/navigating-the-freelance-frontier-your-guide-to-seamless-career-transitions/ar-AA1nuhuk",
    },
  ];

  return (
    <>
      <Typography>
        <Title className="brand-title" level={3}>
          {t(" As Seen on")}
        </Title>
      </Typography>

      <Row
        gutter={[0, 0]}
        style={{
          display: "flex",
          justifyContent: isDesktop ? "space-between" : "center",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {brands.map((brand, index) => (
          <Col
            key={index}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{ width: "100%", maxWidth: "200px", height: "76px" }}
          >
            <a href={brand.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={brand.src}
                alt={`brand-${index}`}
                preview={false}
                width="100%"
                height="100%"
                style={{
                  objectFit: "contain",
                }}
              />
            </a>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default BrandSection;
