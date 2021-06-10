import React from "react";

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/txt');
  res.write(`User-agent: Googlebot
User-agent: AdsBot-Google
User-agent: AdsBot-Google-Mobile
Allow: /
Disallow: /admin
  
User-agent: *
Allow: /
Disallow: /admin
  
Sitemap: ${process.env.API_URL}/sitemap.xml`);
  res.end();

  return { props: {} };
}

const Sitemap: React.FC = () => (<></>)

export default Sitemap;