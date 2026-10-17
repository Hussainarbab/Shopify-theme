# TechNest Shopify theme

A responsive Shopify Online Store 2.0 theme for a Pakistan-focused tech accessories shop. It uses Shopify Liquid, JSON templates, section groups, native product/variant data, Shopify forms, and Shopify cart/checkout routes. There are no paid theme or app dependencies.

## Local theme structure

- `layout/theme.liquid` — document shell, SEO metadata, theme settings, and section groups.
- `templates/` — home, product, collection, collection list, cart, search, 404, policy, and reusable page templates.
- `sections/` — configurable storefront sections and native contact, newsletter, product, and cart flows.
- `snippets/` — product cards, icons, and social metadata.
- `assets/` — responsive styles and lightweight storefront interactions.
- `config/` — editable brand colors, fonts, and layout settings.

## Before opening the store

1. Set the store currency in Shopify admin to PKR if supported for the store's region and payment setup. Theme currency formatting follows the store's Shopify currency settings; a theme cannot change the store currency.
2. Add products, variants, images, inventory, and collections in Shopify admin. Select collections for the homepage's featured-collection sections and connect collection links in the category section.
3. Create Shopify pages with the handles `about`, `contact`, `faq`, `shipping`, and `returns`; assign the matching `page.about`, `page.contact`, `page.faq`, `page.shipping`, and `page.returns` templates. The header supplies these core links if they are absent from the selected navigation menu.
4. In Theme settings > Business contact, add only verified business contact details and social links. Assign a Shopify collection and, if desired, a real image to each homepage category block.
5. Review and replace the sample testimonials. They are explicitly labeled sample content and are not customer endorsements.
6. Review shipping and return content against actual business operations. Configure the store's real privacy and terms policies in Shopify admin; legal placeholders are not legal advice.
7. Set customer-account preferences, payment providers, shipping zones/rates, and notification details in Shopify admin.

## Included sample photography

Theme asset fallbacks use category-matched accessory photographs when Shopify products or collections do not yet have their own photos. Real Shopify product images always take priority. Add your own actual product photographs in Shopify Admin before selling; sample lifestyle photos are illustrative and do not represent a specific TechNest SKU.

Downloaded from Unsplash search results: [phone stand](https://unsplash.com/s/photos/phone-stand), [USB-C cable](https://unsplash.com/s/photos/usb-c-cable), [charger](https://unsplash.com/s/photos/phone-charger-adapter), [power bank](https://unsplash.com/s/photos/power-bank), and [tech accessories](https://unsplash.com/s/photos/tech-accessories). Review source licensing and product accuracy before publishing.

## Preview or upload

Shopify CLI is installed. After authenticating and providing any storefront password directly in your terminal if prompted, run `shopify theme dev --store 0wdrh7-hv.myshopify.com` from this folder. This starts an unpublished development-theme preview; it does not publish the theme. Do not use `shopify theme publish` unless you explicitly intend to publish it. Alternatively, upload a ZIP as an unpublished theme in Shopify admin.

The Shopify account login completed, but the preview attempt stopped when the password-protected storefront requested its storefront password. The theme has not been uploaded or published.
