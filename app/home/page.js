import { list } from "postcss";
import puppeteer from "puppeteer";
import GameCard from "../../components/GameCard";
async function scrap() {
  console.log("running scrap");
  const browser = await puppeteer.launch();

  const game = {
    title: "",
    image: "",
    date: "",
    genres: "",
    companies: "",
    OriginalSize: "",
    RepackSize: "",
    RepackFeatures: "",
    Description: "",
  };

  try {
    const page = await browser.newPage();

    // await page.goto("https://fitgirl-repacks.site/2024/01/");
    await page.goto("https://fitgirl-repacks.site/2016/07/");

    async function scrapeCurrentPage() {
      let gamesList;
      console.log("running scraping current page");
      const result = await page.waitForSelector("div#main");

      const productsOnPage = await page.evaluate(() => {
        console.log("evaluating page");

        gamesList = [
          ...document.querySelectorAll("#main > section > div article"),
        ];

        return gamesList.map((article) => {
          const title = article.querySelector("header > h1").innerText;

          const gameLink = article
            .querySelector("header > h1 > a")
            .getAttribute("href");

          const date = article.querySelector(
            "header > div > span > a > time"
          ).innerText;

          const image = article
            .querySelector("div > p > a > img")
            .getAttribute("src");

          const pElement = article.querySelector("div > p ");

          const anchor = pElement.querySelector("a");
          anchor.remove();

          gameDetails = pElement.innerText.trim().split("\n");
          const finalDetails = gameDetails.map((property) => {
            return property.split(":");
          });

          const OriginalSize = gameDetails["Original Size"];
          const RepackSize = gameDetails["Repack Size"];
          const companies = gameDetails["Company"];

          let tags2;
          if (finalDetails[0] === "Genres/Tags") {
            tags2 = finalDetails[0];
          } else {
            tags2 = [];
          }

          // older games just has magnet link no features list, game description
          const repackFeatures = article.querySelector(
            "div > ul > li:nth-of-type(1)"
          );

          // return repackFeatures.map(li => li.innerText)
          // const featuresMagnet = repackFeatures.map((li) => li.innerHTML);
          //  return featuresMagnet
          //  return featuresMagnet[1]

          let magTorent;
          if (repackFeatures) {
            const links = [...repackFeatures?.querySelectorAll("a")];

            magTorent = links.map((a) => {
              console.log("every a", a.innerHTML);
              let magnet, torrent;
              if (a.innerText === "magnet") {
                magnet = a.getAttribute("href");
              }
              if (a.innerText === ".torrent file only") {
                torrent = a.getAttribute("href");
              }
              // return { magnet, torrent };
              return { magnet, torrent };
            });
          }
          // add repack features

          const repackFeaturesListElement = article.querySelector(
            "div > ul:nth-of-type(2)"
          );
          let RepackFeaturesList;
          if (repackFeaturesListElement) {
            RepackFeaturesList = [
              ...repackFeaturesListElement.querySelectorAll("li"),
            ].map((list) => list.innerText);
          }

          const Description = article.querySelector(
            "div > div:nth-of-type(2)"
          )?.innerText;


          return {
            title,
            gameLink,
            date,
            image,
            tags2,
            companies,
            OriginalSize,
            RepackSize,
            RepackFeaturesList,
            Description,
          }


        });


      });

      return productsOnPage;
    }

    return await scrapeCurrentPage();
  } catch (e) {
    console.log(e);
  } finally {
    browser.close();
  }
}

export default async function Home() {
  const result = await scrap();

console.log(result)
  //  console.log(title,gameLink)

  console.log("this is the result", result);
  return (
    <>
       {result?.map((game) => {
        const {
          title,
            gameLink,
            date,
            image,
            tags2,
            companies,
            OriginalSize,
            RepackSize,
            RepackFeaturesList,
            Description
        } = game;

        return (
          <GameCard
            tags={tags2}
            companies={companies}
            OriginalSize={OriginalSize}
            RepackSize={RepackSize}
            repackFeaturesList={RepackFeaturesList}
            Description={Description}
            title={title}
            gameLink={gameLink}
            image={image}
            date={date}
          />
        );
      })} 
    </>
  );
}
