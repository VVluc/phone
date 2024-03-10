import { gql, GraphQLClient } from 'graphql-request';

const hygraph = new GraphQLClient('https://ap-northeast-1.cdn.hygraph.com/content/cltfu0tmw00h208jk4yikbyy6/master', {
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MDk3MzE1NjYsImF1ZCI6WyJodHRwczovL2FwaS1hcC1ub3J0aGVhc3QtMS5oeWdyYXBoLmNvbS92Mi9jbHRmdTB0bXcwMGgyMDhqazR5aWtieXk2L21hc3RlciIsIm1hbmFnZW1lbnQtbmV4dC5ncmFwaGNtcy5jb20iXSwiaXNzIjoiaHR0cHM6Ly9tYW5hZ2VtZW50LWFwLW5vcnRoZWFzdC0xLmh5Z3JhcGguY29tLyIsInN1YiI6IjMzZTE1NDNhLWYyNmEtNGY0OS04MzY0LWM4YzlmODkxMmVhYyIsImp0aSI6ImNrYTVqMmVvYjAzdGMwMXdoMGRmZDY3cnkifQ.QHRct5H4klYTc10Ow23zfEijdIbs_tmYwsx1orTehWv4em_FGC1sEkxjvcNEga3uVfN2qGhkMzffMO1gizus4R9D1Ny96DtannFDKdRzoMgj5XNwIVb9b28YmrmJHiLbtF3u_HwxDPaAPBC1rdyzKqSDAaHpYpKFneJpF-3XVe0UzIqlW5F7sk18D_3MFjHnOh5FJtR6sOsvcNVK37FhrcHhKR5_eXYu2wC1Y40m4fJdGzdtgomRtATy2kzIDyZ59Z6VDIoPGm-qSDVag6l3gt36W0mA5BLyM7332WLRKOO25RIZBZsLXBU1TZ38Fq6iQADemeMHpL9J_vbsQzRTVJGlKv2LYzv-LmX-_g6ANAc17qxdYESkYFRKHhtllQoRifISyfVsVIUyL2YGj9OKbV35nkmfuVqOZ1nobLGAFJTbiTDvVsaVpd8x_NU3k0NUcB3c5zkKy6LKXRtnB21eguwjYc2Y82EKAGErSmLEJ9b6hLfyv5Bqn1Iu8guFu-cieiDy_sgHeabLpp0MyXEXVBDGFEUsoF6Vi2FDCPrY2rI6SVHwZXHr8vcd2rIrY5-krABznasPN2rKmRYjKvWlcT5tQ1uz_0Da0R0K6IZDD7BYFjJ8Dly-n_RE68MHdnP18Hey7nDeMDStEQJ4DEf0aR-KmYVtdKHoVPZBMMBcr30',
  },
});

export const getAllArticlesForHome = async () => {
  const QUERY = gql`
    {
      articles(orderBy: publishedAt_DESC) {
        publishedAt
        slug
        title
        bannerImage {
          url
        }
      }
    }
  `;
  const { articles } = await hygraph.request(QUERY);

  return articles;
};

export const getArticleBySlug = async (slug: string) => {
  const QUERY = gql`
    query Articles($slug: String!) {
      article(where: { slug: $slug }) {
        publishedAt
        slug
        title
        content {
          json
        }
        bannerImage {
          url
        }
        createdBy {
          name
          picture
        }
      }
    }
  `;
  const { article } = await hygraph.request(QUERY, { slug });

  return article;
};
