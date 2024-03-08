export default function GameCard({
  title,
  gameLink,
  date,
  image,
  tags,
  companies,
  OriginalSize,
  RepackSize,
  repackFeaturesList,
  Description,
}) {
  console.log(repackFeaturesList , "this is repack features");

  return (
    <div className=" bg-red-300 mt-10">
      title : {title}
      <br />
      gameLink : {gameLink}
      <br />
      date : {date}
      <br />
      image : {image}
      <br />
      tags : {tags}
      <br />
      companies : {companies}
      <br />
      OriginalSize : {OriginalSize}
      <br />
      RepackFeatureList :
      {repackFeaturesList?.map((line) => (
        <div>
          <li>{line}</li> <br />
        </div>
      ))}
      <br />
      Description : {Description}
    </div>
  );
}
