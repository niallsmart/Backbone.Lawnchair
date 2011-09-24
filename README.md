# Backbone Lawnchair Adapter

A drop-in replacement for `Backbone.sync` that uses a Lawnchair instance for persistence

[Lawnchair](http://westcoastlogic.com/lawnchair/) is a simple cross-browser JSON storage engine. This adapter is useful for browsers that don't support the DOM `localStorage` APIs.

## Usage

Include `backbone.lawnchair.js` after `backbone.js`:

    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="backbone.lawnchair.js"></script>

Then specify the Lawnchair instance to use for each collections like so:

    window.SomeCollection = Backbone.Collection.extend({
      
      localStorage: new Lawnchair(new Function(), { name: "SomeCollection"} ), // Unique name within your app.
      
      // ... everything else is normal.
      
    });
  
## Credits

This code is based on [backbone.localStorage](https://github.com/jeromegn/Backbone.localStorage) by Jerome Gravel-Niquet and others.

