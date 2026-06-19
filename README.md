# Part-3
WEDE5020 Part 3
Football Academy Plus Bruma - Website

Student Number: ST10508782

Module: WEDE5020

Part: 3 - Enhancing Functionality and SEO

Deployed URL: https://plusbrumafc.netlify.app

Project Overview

The website is for the Plus Bruma Football Academy - a football academy that was founded in 2019 in Bruma, Johannesburg, South Africa. The academy trains boys and girls aged between 6 and 18 years old.

File Structure

/
├── Home.html
├── About us.html
├── Product.html
├── Sessions.html
├── Contact Details.html
├── Enquiry.html
├── Sign-Up.html
├── robots.txt
├── sitemap.xml
├── README.md
├── CSS/
│   └── style.css
├── JS/
│   └── main.js
└── images/
    ├── Plus(1).jfif
    ├── Plus(2).jfif
    ├── Products(1).jfif
    ├── Products(2).jpg
    ├── Products(3).webp
    ├── Products(4).webp
    ├── Products(5).jfif
    └── Products(6).jpg

How to Run Locally on VS Code

To run the website locally on VS Code:

Open the project folder in VS Code.

Install the Live Server extension from VS Code’s extension marketplace (by searching for “Live Server” and installing the extension by ritwickdey.LiveServer).

Click on Home.html in the explorer panel on the left.

Right-click on the page and click on “Open with Live Server”.

The website will automatically open in your default browser at the following link: http://127.0.0.1:5500/Home.html

The project files have to remain in the current folder. The CSS and JS folders should remain within the project itself.

Pages

There are 7 pages on the website for the Plus Bruma Football Academy:

PageFileDescriptionHomeHome.htmlThis is the landing page for the website. It contains a news ticker, CTA buttons, and information about the academy.About UsAbout us.htmlThis page contains information about the academy, such as its history and goals, and features animated statistics about the academy.ProductsProduct.htmlThis page acts as an online shop for the academy’s products. It features a search bar to search for products by name.SessionsSessions.htmlThis page contains a table of training sessions for each week of the coming months.ContactContact Details.htmlThis page contains contact information for the academy, including its map on Google Maps, and links to its social media websites. There is also a contact form on this page.EnquiryEnquiry.htmlThis page contains a form that users can use to contact the academy with specific enquiries. The form features dynamic content that fills out according to the type of enquiry the user selects.Sign UpSign-Up.htmlThis page is used for players to enrol in the academy. It features 4 steps to register a new player.

Part 3 Features

External JavaScript - JS/main.js (16 functions, zero inline JavaScript)

#FunctionDescription1initPageFadeMakes the page fade in when the user loads the page.2initHeaderEffectsCreates a gold bar that indicates the user scrolls down the page, and also causes the headings to glow when the user hovers over them.3initMobileMenuCreates a mobile menu that displays when the user clicks on a hamburger menu icon.4initActiveNavDetects the current page that the user is on and highlights the link in the navigation menu.5initScrollRevealCauses the information cards on the website to animate in on scroll.6initCountersCauses the statistics on the About Us page to count up to their number as the user scrolls into view of the page.7initProductSearchMakes the product search bar on the Products page work.8initLightboxMakes the product image gallery on the Products page display the full size image when clicked.9initTickerMakes the news ticker on the Home page rotate its news posts.10initEnquiryFormMakes the enquiry form on the Enquiry page to validate the user’s form fields and display dynamic content according to the type of enquiry.11initContactFormMakes the contact form on the Contact Details page to validate the user’s form fields and prefill the email client for the academy’s address (faplusbruma@gmail.com).12initSignUpFormMakes the sign up form on the Sign-Up page to display the player’s age as they type in the date of birth field, prefill the last step of the sign up form, and display a trophy when they are successfully completed the registration.13initBackToTopCreates a button in the top right of the screen that will scroll the user back to the top of the page after they scroll 500px down the screen.14initFooterYearAutomatically updates the copyright year at the bottom of the screen to the current year.15initSmoothScrollSmoothly scrolls the user to any page link on the website.

SEO

Each page features its own SEO elements in the <head> of the page:

A unique page <title> tag

A unique page description in the <meta name="description"> tag

Keywords in the <meta name="keywords"> tag

<meta name="robots" content="index, follow">

Open Graph elements: og:title, og:description, og:type

All images feature descriptive <alt> text

Table headers on the Sessions page have scope="col" attributes

Semantic HTML elements are used throughout the site

Forms

The Enquiry form and Contact form have been enhanced through JavaScript validation for each field. The Enquiry form will respond with different information depending on the type of enquiry that the user has selected. The Contact form will automatically open the user’s email application and prefill the contact information for the academy (faplusbruma@gmail.com). The Sign-Up form requires the user to complete 4 steps to register as a player. As they scroll through the steps, their age is automatically calculated, they are taken to the review of the form they selected, and once they agree to the terms and conditions they are presented with a trophy to indicate that they have successfully enrolled in the academy.

Colour Scheme Enforcement for all Input Fields

The colour scheme for all the input fields on the site was changed from the default white to the dark gold colour scheme that is used throughout the rest of the site. The technique used was to change the CSS of the site to include the following:

color-scheme: dark within the :root element and each of the individual input fields

background: #111108 !important within each of the input fields

-webkit-box-shadow: 0 0 0 1000px #1a1800 inset !important within each of the input fields

transition: background-color 5000s within each of the input fields

Each of these changes were made within an inline <style> element in the <head> of each of the HTML files for maximum browser compatibility.

Social Media Links (Contact Details.html)

The Contact Details page features links to the academy’s social media profiles with the following links and features:

Facebook: An SVG image of the Facebook logo in its brand blue color. This links to the academy’s official Facebook page: https://www.facebook.com/FAPlusBruma

Instagram: Links to the academy’s Instagram page: https://www.instagram.com/faplusbruma

YouTube: Links to the academy’s YouTube channel: https://www.youtube.com/@FootballAcademyPlusBruma

Each of these links open in a new tab in the user’s web browser using the rel="noopener noreferrer" attribute to improve online security.

Changelog

Part 3 - June 2026

FIXED All input fields - changed to dark gold colour scheme to match the rest of the website

FIXED Product search - excluded product cards from scroll reveal animations

FIXED The link “link rel=”javascript”” has been replaced with the correct link to the external JavaScript file

ADDED JS/main.js - An external JavaScript file with 16 functions

ADDED Enquiry.html - A new page with an enquiry form with validation and dynamic content

ADDED Sign-Up.html - A new page with a form that allows players to register to attend the academy

ADDED robots.txt - A file that specifies to search engines which web pages to index on the site

ADDED sitemap.xml - An XML file that lists all of the web pages on the site

ADDED SEO meta tags - Added to each web page on the website

ADDED Contact form - Added to the Contact Details page

ADDED Links to social media websites - Added to the Contact Details page

ADDED A search bar for products - Added to the Products page

ADDED Links to Enquiry and Sign Up forms to the navigation menu on all web pages

IMPROVED CSS - Completely restructured site to feature a design token system, type scale, spacing scale, and component styles

IMPROVED CSS - Dark gold colour scheme for forms, modals, buttons, and other elements

Part 2 - May 2026

Created an external CSS and style.css file - This file stores all of the CSS for the website and has replaced all inline CSS

Added CSS custom properties for the colour scheme (gold and black)

Added Google Fonts to the project: Bebas Neue, Oswald, Lato

Revised the site navigation menu

Fixed issues on the following web pages: Home.html, About us.html, Product.html, Sessions.html, Contact Details.html

Removed all instances of the “font” tag, “align” attribute, “background” attribute, and inline “color” attributes

Added the viewport meta tag to all web pages

References

Google (2024) Google Maps Embed API. Available at: https://developers.google.com/maps (Accessed: June 2026).

Google Fonts (2024) Bebas Neue, Oswald, Lato. Available at: https://fonts.google.com (Accessed: June 2026).

MDN Web Docs (2024) IntersectionObserver API. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: June 2026).

MDN Web Docs (2024) HTML forms - form validation. Available at: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation (Accessed: June 2026).

MDN Web Docs (2024) The mailto URL scheme. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a (Accessed: June 2026).

Sitemaps.org (2024) XML Sitemap protocol. Available at: https://www.sitemaps.org/protocol.html (Accessed: June 2026).

Google Search Central (2024) robots.txt introduction. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: June 2026).

W3C (2024) Web Content Accessibility Guidelines (WCAG) 2.1. Available at: https://www.w3.org/TR/WCAG21/ (Accessed: June 2026).

Facebook for Developers (2024) Brand resources. Available at: https://developers.facebook.com (Accessed: June 2026).
