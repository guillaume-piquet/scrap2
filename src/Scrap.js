
import cheerio from 'cheerio';
import xmlhttprequest from 'xmlhttprequest';


// URL for data
const URL_UPSTONE = "https://www.upstone.co";
const URL_UPSTONE_LIST = '/crowdfunding';
const URL_CLUB = "https://www.clubfunding.fr/projets/";
const URL_CLUB_LIST = 'https://api.clubfunding.fr/api/project-list';
const URL_CLUB_FILE = 'https://api.clubfunding.fr/';
const URL_PREMIERE = "https://www.lapremierebrique.fr";
const URL_PREMIERE_LIST = '/fr/projects';

// function to get the raw data
const getRawData = (URL) => {
    let xhr = new xmlhttprequest.XMLHttpRequest();
    xhr.open('GET', URL, false);
    xhr.send();
    return xhr.responseText;
 };
 const realTrim = (str) => {
  return str.trim().replace(/[\n\t\r]/g,"").replace(/\s+/g, ' ').trim();
 };
 const numberTrim = (str) => {
  return str.trim().replace(/[\n\t\r]/g,"").replace(/\s+/g, '').trim();
 };
/**
 * reccuperation des dossiers pour  UPSTONE
 * @returns 
 */
 const parseUpstone = () =>{

   const rawData =  getRawData(URL_UPSTONE + URL_UPSTONE_LIST);
   
 
   // parsing the data
   const $ = cheerio.load(rawData);
 
   var ret = [];  
   
   $('.projects',rawData).find('.project').each(  function() {
    const plateform = 'Upstone'
    const title =  realTrim($(this).find('.h1').text());
    const description =  realTrim($(this).find('.main-description').text());
    const url = URL_UPSTONE+$(this).find('a').attr('href');
    const img  = URL_UPSTONE + $(this).find('.illustration').attr('style').match(/url\('(.*?)'/)[1];
    const state = realTrim($(this).find('.project-tag').text());
    const date = '';
    let profit = '';
    let amount = '';
    let periode = '';
    let type = '';
    let location = '';
    $(this).find('.details').find('.value').each(function (idx, el) {
      if(idx === 0){
        amount = parseFloat(numberTrim($(el).text()));
      }
      if(idx === 1){
        type = $(el).text();
      }
      if(idx === 2){
        location = $(el).text();
      }
      if(idx === 3){
        periode = parseFloat(numberTrim($(el).text()));
      }

    });
    //documents
    let docData = getRawData(url+'/documents');

      const $Proj = cheerio.load(docData);
      const documents = [];
      $Proj('.documents-list').find('.document-line').each(function (idx, el) {
        documents.push( { 'title' : realTrim($Proj(el).find('.document-name').text()), 'url' : url+'/documents' ,'date'  : $Proj(el).find('.document-date').text() } );
      }); 


    ret.push({plateform, type, title, location, url, img, state, description, profit, amount, periode, date,documents});
   });
  
   //fs.writeFileSync('src/resultat/upstone.json',JSON.stringify(ret,null,4));
   return ret;
   
 }

 /**
 * reccuperation des dossiers pour  La premiere brique
 * @returns 
 */
  const parsePremiere = () =>{

    const rawData =  getRawData(URL_PREMIERE + URL_PREMIERE_LIST);
    
  
    // parsing the data
    const $ = cheerio.load(rawData);
  
    var ret = [];  
    
    $('#projectsCardDeck',rawData).find('.project-card').each(  function() {
  
    const plateform = 'La première brique'
     const title =  realTrim($(this).find('.card-title').text());
   
     const url = URL_PREMIERE+$(this).find('a').attr('href');
     const img  =  $(this).find('.card-img-top').attr('src');
     const state = $(this).find('.project-status').attr('src').split('/')[5].split('-')[0];
     const date = realTrim($(this).find('.card-body .mb-0').text().split('le ')[1]);
     let profit = '';
     let amount = '';
     let periode = '';
     let type = 'Marchand de biens';
     let location = realTrim($(this).find('.mb-0').text().substring(0,3));
     $(this).find('tbody').find('tr').each(function (idx, el) {
       if(idx === 0){
         amount = parseFloat(numberTrim(''+$(el).text()));
       }
       
       if(idx === 2){
        profit = parseFloat(numberTrim( (''+$(el).text()).substring(0,10) ));
        periode = parseFloat(numberTrim( (''+$(el).text()).substring(18) ));
       }
       
 
     });
     //detail
      let detail = getRawData(url);
     
      const $Proj = cheerio.load(detail);
      const description =  $Proj('.projectPresentation').text();
      const documents = [];
      $Proj('#projectDocuments').find('a').each(function (idx, el) {
        documents.push( { 'title' : realTrim($Proj(el).text()), 'url' : $Proj(el).attr('href') } );
      }); 

      ret.push({plateform, type, title, location, url, img, state, description, profit, amount, periode, date, documents})
    
    });
   
   // fs.writeFileSync('src/resultat/lapremierebrique.json',JSON.stringify(ret,null,4));
    return ret;
    
  }

 /**
 * reccuperation des dossiers pour  CLUBFUNDING
 * @returns 
 */
  const parseClub = () =>{
    const rawData =  getRawData(URL_CLUB_LIST);
    
  
    // parsing the data
    const $ = JSON.parse(rawData);
  
    var ret = [];  
    $.response.forEach(  function(project) {
     const plateform = 'Club-funding' 
     const title =  realTrim(project.title);
     const description =  realTrim(project.text);
     const url = URL_CLUB+'projets/'+project.slug;
     const img  = URL_CLUB_FILE + project.imgpath;
     const state = project.textstatut;
     const profit = parseFloat(project.profitability);
     const amount = project.price;
     const periode = project.periode;
     const type = project.categorie;
     const location = project.localisation
     const date = project.date_creation;
     ret.push({plateform, type, title, location, url, img, state, description, profit, amount, periode, date});
    });

   // fs.writeFileSync('src/resultat/clubFunding.json',JSON.stringify(ret,null,4));
    return ret;
    
  }

  function Scrap() {
  const result_upstone =   parseUpstone();
  const result_premiere =  parsePremiere();
  const result_club =   parseClub();

  return  <div className="Scrap">
      {JSON.stringify([...result_upstone, ...result_premiere, ...result_club],null,4)} 
      </div>
  }

  export default Scrap;







