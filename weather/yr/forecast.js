[{
  Name: 'Yr forecast',
  Author: 'Sigbj??rn Trageton',
  Version: '1.0',
  IconImage: 'pages/control/widgets/weather/yr/images/logo-yr-50.png',

  RenderView: function (cuid, module) {
    var container = $(cuid);
    var widget = container.find('[data-ui-field=widget]');
    var _this = this;
    if (!this.Initialized)
    {
      this.Initialized = true;

      widget.find('[data-ui-field=settings]').on('click', function () {
        HG.WebApp.ProgramEdit._CurrentProgram.Domain = module.Domain;
        HG.WebApp.ProgramEdit._CurrentProgram.Address = module.Address;
        HG.WebApp.ProgramsList.UpdateOptionsPopup();
      });
    }
    var locationCity = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.City').Value;
    var locationRegion = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.Region').Value;
    var display_location = locationCity + " (" + locationRegion + ")";
    // render widget
    widget.find('[data-ui-field=name]').html(display_location);
    widget.find('[data-ui-field=description]').html('Forecast for the next four periods');
    widget.find('[data-ui-field=updatetime]').html('default widget template');
    var symbolId = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.WeatherSymbol').Value;
    var symbolVariant = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.WeatherSymbol.Variant').Value;    

    widget.find('[data-ui-field=forecast_symbol]').attr('src', this.GetWeatherIcon(symbolId, symbolVariant));
    var temperature = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.Temperature').Value;
    widget.find('[data-ui-field=temp_now_value]').html(temperature + "&deg;");
    widget.find('[data-ui-field=temp_now_value]').addClass(this.GetTemperatureCssClass(temperature));
    var windSpeed = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.WindSpeed').Value;
    widget.find('[data-ui-field=forecast_wind]').html(windSpeed + " m/s");
    var windChill = this.GetWindChill(temperature, windSpeed);
    widget.find('[data-ui-field=forecast_feels_like]').html(windChill.toString() + "&deg;");
    widget.find('[data-ui-field=forecast_feels_like]').addClass(this.GetTemperatureCssClass(windChill));
    
    var minTemp = parseInt(HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.MinTemp').Value);
    var maxTemp = parseInt(HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.MaxTemp').Value);
    widget.find('[data-ui-field=forecast_temp_min]').html(minTemp + "&deg;");
    widget.find('[data-ui-field=forecast_temp_min]').addClass(this.GetTemperatureCssClass(minTemp));
    widget.find('[data-ui-field=forecast_temp_max]').html(maxTemp + "&deg;");
    widget.find('[data-ui-field=forecast_temp_max]').addClass(this.GetTemperatureCssClass(maxTemp));
    
    for(var i = 1; i <= 4; i++)
    {
      symbolId = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.Forecast.' + i + '.WeatherSymbol').Value;
      symbolVariant = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.Forecast.' + i + '.WeatherSymbol.Variant').Value;
      widget.find('[data-ui-field=forecast_symbol_' + i + ']').attr('src', this.GetWeatherIcon(symbolId, symbolVariant));
      var temp = parseInt(HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.Forecast.' + i + '.Temperature').Value);
      temperature = temp + "&deg;";
      widget.find('[data-ui-field=forecast_temp_' + i + ']').html(temperature);
      if(temp <= 0)
        widget.find('[data-ui-field=forecast_temp_' + i + ']').addClass('value--cold');
      else
        widget.find('[data-ui-field=forecast_temp_' + i + ']').addClass('value--warm');
      var period = HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.Forecast.' + i + '.Period').Value;
      widget.find('[data-ui-field=forecast_timespan_' + i + ']').html(period);
    }
    var lastUpdate = new Date(HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.LastUpdate').Value);
    var nextUpdate = new Date(HG.WebApp.Utility.GetModulePropertyByName(module, 'Conditions.NextUpdate').Value);
    widget.find('[data-ui-field=update_value]').html("Updated: " + this.GetTime(lastUpdate) + ", next update: " + this.GetTime(nextUpdate));
  },
  
  GetTime: function(dateObject) {
    var h = (dateObject.getHours()<10?'0':'') + dateObject.getHours(),
        m = (dateObject.getMinutes()<10?'0':'') + dateObject.getMinutes();
    return h + '' + m;
  },
  GetTemperatureCssClass: function(temperature)
  {
  	if(temperature <= 0)
      return "value--cold";
    else
      return "value--warm";
  },
  
  GetWindChill: function(temperature, windSpeed)
  {
    var temp = parseFloat(temperature);
    var wind = parseFloat(windSpeed);
    if(temp > 10 || wind < 1.3)
      return temperature;
	var windSpeedInKmH = wind * 3.6;
    var windChill = Math.Round((13.12 + 0.6215*temp - 11,37*Math.Pow(windSpeedInKmH, 0.16) + 0.3965*windSpeedInKmH*Math.Pow(windSpeedInKmH, 0.16)), 0);
    return windChill;
  },
  
  GetWeatherIcon: function(symbolId, variant)
  {
    if(symbolId.length < 2)
      symbolId = "0" + symbolId;
    switch(variant)
    {
        case(""):
        	break;
        case("Sun"):
        	symbolId += "d";
            break;
        case("Moon"):
        	symbolId += "n";
        	break;
    }
	return "pages/control/widgets/weather/yr/images/weather_symbols/" + symbolId + ".png";
  }
}]