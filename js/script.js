const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

//global store
let photoArray = [];

//count number of image loaded and to check if totalImage === imagesloaded --> fetch again extra data from api
let imagesLoaded = 0;
let totalImages = 0;
let ready = false;

function imageLoaded() {
    //increamenting +1
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
    }
}
function displayPhotos() {
    //reset imageLoaded because if the ready was true it will increament to +10 =20. so  imagesLoaded === totalImages will be always false.
    imagesLoaded = 0;

    //set totalImages loaded in the array
    totalImages = photoArray.length;

    // dry(don't repeat yourself) setAttributes
    function setAttributes(element, attributes) {
        //this will loop the only {👉key👈:value}  in your object
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }


    photoArray.forEach((data) => {
        /* ☝️st way create a element using createElement then set the attribute using "element.setAttribute(name,value);" */

        //create a anchor tag to get  that clicked picture in unsplash.com
        const a = document.createElement("a");
        setAttributes(a, {
            href: data.links.html,
            target: "_blank",
        });

        // create a image tag to display the images
        const img = document.createElement("img");
        setAttributes(img, {
            src: data.urls.regular,
            alt: data.alt_description || "Unknown",
            title: data.alt_description || "Unknown",
        });

        //put the img inside the a & put a to the imageContainer
        a.appendChild(img);
        imageContainer.appendChild(a);
        img.addEventListener("load", imageLoaded);


        // /*✌️nd way  write a raw html element using template literal */
        // const a = `<a href=${data.links.html} target="_blank"><img src=${data.urls.regular} alt=${data.alt_description || "UnSpecified"} title=${data.alt_description || "UnSpecified"}></a>`

        // /*it will convert the template literal to html then append to imageContainer */
        // imageContainer.insertAdjacentHTML("beforeend", a);
    });
}

// get photos from unsplashAPI
async function getPhotos() {
    /* setting up url for fetch unsplash images data
     
      * https://api.unsplash.com/photos/ --> url
      * random/             --> to get random image
      * ?client_id="apiKey" --> accessKey from unsplash documentation
      * &count="count"      --> how many images you need "count"
      
      */
    const url = `https://api.unsplash.com/photos/random/?client_id=${process.env.ACCESS_KEY}&count=${10}`;

    try {
        //fetching data from setuped unsplashAPI url
        const response = await fetch(url);
        photoArray = await response.json();
        displayPhotos();
        console.log(photoArray);
    } catch (error) {
        // you can console or alert the error to display if any thing wrong happens
    }
}

// on load
getPhotos();

window.addEventListener("scroll", () => {

    // window.scrollY -> already scrolled value +
    // window.innerHeight -> viewport height value
    // document.body.offsetHeight -> entire page height (body element height)
    if (
        window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 &&
        ready
    ) {

        getPhotos();
        // without this it will run more then 1 times.
        //because scroll event calculation was very slow.
        ready = false;
    }
});
