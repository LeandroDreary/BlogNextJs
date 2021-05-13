import React from "react";

export async function getServerSideProps({ res }) {
  let { posts } = { posts: null }
  try {
    posts = (await (await fetch(process.env.API_URL + '/api/post/list?select=link%20publishDate')).json())?.result
  } catch (e) { }
  res.setHeader('Content-Type', 'text/xml');
  res.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${process.env.API_URL}</loc>
      <lastmod>2020-12-22T20:15:08+00:00</lastmod>
      <priority>1.00</priority>
    </url>`+
        `${posts.map(post => 
        `<url>
          <loc>${process.env.API_URL + "post/" + post?.link}</loc>
          <lastmod>${post?.publishDate ? ((new Date(post?.publishDate)).getFullYear() + "-" + (("0" + ((new Date(post?.publishDate)).getMonth() + 1)).slice(-2)) + "-" + ("0" + (new Date(post?.publishDate)).getDate()).slice(-2)) : ""}</lastmod>
          <priority>8</priority>
        </url>`)}` +
    `</urlset>`);
  res.end();

  return { props: {} };
}

const Sitemap: React.FC = () => (<></>)

export default Sitemap;