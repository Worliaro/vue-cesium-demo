import * as Cesium from "cesium";

function WebGLGlobeDataSource(name) {
  // All public configuration is defined as ES5 properties
  // These are just the "private" variables and their defaults.
  this._name = name;
  this._changed = new Cesium.Event();
  this._error = new Cesium.Event();
  this._isLoading = false;
  this._loading = new Cesium.Event();
  this._entityCollection = new Cesium.EntityCollection();
  this._seriesNames = [];
  this._seriesToDisplay = undefined;
  this._heightScale = 10000000;
  this._entityCluster = new Cesium.EntityCluster();
}
Object.defineProperties(WebGLGlobeDataSource.prototype, {
  // The below properties must be implemented by all DataSource Instances
  /**
   * Gets a human-readable name for this instance
   * @memberof WebGLGlobeDataSource.property
   * @type {String}
   */
  name: {
    get: function () {
      return this._name;
    },
  },
  /**
   * Since WebGL globe JSON is not time-dynamic, this property is always undefined.
   * @memberof WebGLGlobeDataSource.prototype
   * @type {DataSourceClock}
   */
  clock: {
    value: undefined,
    writable: false,
  },
  /**
   * Gets the collection of Entity Instances
   * @memberof WebGLGlobeDataSource.prototype
   * @type {EntityCollection}
   */
  entities: {
    get: function () {
      return this._entityCollection;
    },
  },
  /**
   * Gets a value indicating if the data source is currently loading data.
   * @memberof WebGLGlobeDataSource.prototype
   * @type {Boolean}
   */
  isLoading: {
    get: function () {
      return this._isLoading;
    },
  },
  /**
   * Gets an event that will be raised when the underlying data changes.
   * @memberof WebGLGlobeDataSource.prototype
   * @type {Event}
   */
  changedEvent: {
    get: function () {
      return this._changed;
    },
  },
  /**
   * Gets an event that will be raised when an error encountered during processing
   * @memberof WebGLGlobeDataSource.prototype
   * @type {Event}
   */
  errorEvent: {
    function() {
      return this._error;
    },
  },
  /**
   * Gets an event that will be raised when the data source either starts or stops loading.
   * @memberof WebGLGlobeDataSource.prototype
   * @type {Event}
   */
  loadingEvent: {
    get: function () {
      return this._loading;
    },
  },

  // These properties are specific to this DataSource.
  /**
   * Gets the array of series names.
   * @memberof WebGLGlobeDataSource.prototype
   * @type {String[]}
   */
  seriesNames: {
    get: function () {
      return this._seriesNames;
    },
  },
  /**
   * Gets or sets the name of te series to display. WebGL JSON is designed
   * so that only one series is viewed at a time.
   * Valid values are defined in the seriesNames property.
   * @memberof WebGLGlobeDataSource.prototype
   * @type {String}
   */
  seriesToDisplay: {
    get: function () {
      return this._seriesToDisplay;
    },
    set: function (value) {
      this._seriesToDisplay = value;
      // Iterate over all entities and set their show property to true only if they are part of the current series
      var collection = this._entityCollection;
      var entities = collection.values;
      collection.suspendEvents();
      entities.forEach((one) => {
        one.show = value === one.seriesName;
      });
      collection.resumeEvents();
    },
    /**
     * Gets or sets the scale factor applied to the height of each line.
     * @memberof WebGLGlobeDataSource.prototype
     * @type{Number}
     */
    heightScale: {
      get: function () {
        return this._heightScale;
      },
      set: function (value) {
        if (value < 0) {
          throw new Cesium.DeveloperError("value must be greater than zero.");
        }
        this._heightScale = value;
      },
    },
    /**
     * Gets whether or not this data source should be displayed.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Boolean}
     */
    show: {
      get: function () {
        return this._entityCollection;
      },
      set: function (value) {
        this._entityCollection = value;
      },
    },
    /**
     * Gets or sets the clustering options for this data source. This object can be shared between multiple data sources.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {EntityCluster}
     */
    clustering: {
      get: function () {
        return this._entityCluster;
      },
      set: function (value) {
        if (!Cesium.defined(value)) {
          throw new Cesium.DeveloperError("value must be defined.");
        }
        this._entityCluster = value;
      },
    },
  },
});

WebGLGlobeDataSource.prototype._setLoading = function (isLoading) {
  if (this._isLoading !== isLoading) {
    this._isLoading = isLoading;
    this._loading.raiseEvent(this, isLoading);
  }
};

WebGLGlobeDataSource.prototype.loadUrl = function (url) {
  debugger;
  if (!Cesium.defined(url)) {
    throw new Cesium.DeveloperError("url is required.");
  }
  // create a name based on the url
  var name = Cesium.getFilenameFromUri(url);
  // set the name if it is different than the current name.
  if (this._name !== name) {
    this._name = name;
    this._changed.raiseEvent(this);

    //Use 'when' to load the URL into a json object
    //and then process is with the `load` function.
    var that = this;
    debugger;
    return Cesium.Resource.fetchJson(url)
      .then(function (json) {
        return that.load(json, url);
      })
      .otherwise(function (error) {
        //Otherwise will catch any errors or exceptions that occur
        //during the promise processing. When this happens,
        //we raise the error event and reject the promise.
        this._setLoading(false);
        this._error.raiseEvent(that, error);
        return Cesium.when.reject(error);
      });
  }
};

/**
 * Loads the provided data, replacing any existing data.
 * @param{Array} data the object to be processed
 */
WebGLGlobeDataSource.prototype.load = function (data) {
  if (!Cesium.defined(data)) {
    throw new Cesium.DeveloperError("data is required.");
  }
  debugger;
  // clear out any data that might already exist
  this._setLoading(true);
  this._seriesNames.length = 0;
  this._seriesToDisplay = undefined;
  var heightScale = this.heightScale;
  var entities = this._entityCollection;
  //It's a good idea to suspend events when making changes to a
  //large amount of entities.  This will cause events to be batched up
  //into the minimal amount of function calls and all take place at the
  //end of processing (when resumeEvents is called).
  entities.suspendEvents();
  entities.removeAll();
  //WebGL Globe JSON is an array of series, where each series itself is an
  //array of two items, the first containing the series name and the second
  //being an array of repeating latitude, longitude, height values.
  //
  //Here's a more visual example.
  //[["series1",[latitude, longitude, height, ... ]
  // ["series2",[latitude, longitude, height, ... ]]
  // Loop over each series
  for (var x = 0; x < data.length; x++) {
    var series = data[x];
    var seriesName = series[0];
    var coordinates = series[1];
    // add the name of the series to our list of possible values.
    this._seriesNames.push(seriesName);
    // Make the first series the visible one by default.
    var show = x === 0;
    if (show) {
      this._seriesToDisplay = seriesName;
    }
    // now loop over each coordinate in the series and create our entities from the data.
    for (var i = 0; i < coordinates.length; i += 3) {
      var latitude = coordinates[i];
      var longitude = coordinates[i + 1];
      var height = coordinates[i + 2];
      //Ignore lines of zero height.
      if (height === 0) {
        continue;
      }
      var color = Cesium.Color.fromHsl(0.6 - height * 0.5, 1.0, 0.5);
      var surfacePosition = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        0
      );
      var heightPosition = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height * heightScale
      );
      // WebGL only contains line, so that's the only graphics we create.
      var polyline = new Cesium.PolylineGraphics();
      polyline.material = new Cesium.ColorMaterialProperty(color);
      polyline.width = new Cesium.ConstantProperty(2);
      polyline.arcType = new Cesium.ConstantProperty(Cesium.ArcType.NONE);
      polyline.positions = new Cesium.ConstantProperty(
        surfacePosition,
        heightPosition
      );
      //The polyline instance itself needs to be on an entity.
      var entity = new Cesium.Entity({
        id: seriesName + " index " + i.toString(),
        show: show,
        polyline: polyline,
        seriesName: seriesName, //Custom property to indicate series name
      });
      // add the entity to the collection
      entities.add(entity);
    }
  }
  // once all data is processed. call resumeEvent and raise the changed event.
  entities.resumeEvents();
  this._changed.raiseEvent(this);
  this._setLoading(false);
};

export default WebGLGlobeDataSource;
