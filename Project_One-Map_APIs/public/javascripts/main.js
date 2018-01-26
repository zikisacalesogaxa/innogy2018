const apiUrl = 'https://developer.nrel.gov/api/windexchange/schoolprojects?api_key=BpwET3I8qcPGHgBcgcECMNuYXfDVEz3zwKN00w1f';

let citiesData = null;

function Project(
  sourcemap,
  address,
  additionalResources,
  discussion,
  contactEmailAddress,
  contactName,
  contactPhone,
  city,
  countryName,
  postalCode,
  projectName,
  projectType,
  province,
  status,
  technologyDescription,
) {
  this.sourcemap = sourcemap;
  this.address = $.trim(address);
  this.additionalResources = additionalResources;
  this.discussion = $.trim(discussion);
  this.contactEmailAddress = $.trim(contactEmailAddress);
  this.contactName = $.trim(contactName);
  this.contactPhone = $.trim(contactPhone);
  this.city = $.trim(city);
  this.countryName = $.trim(countryName);
  this.postalCode = postalCode;
  this.projectName = $.trim(projectName);
  this.projectType = $.trim(projectType);
  this.province = $.trim(province);
  this.status = $.trim(status);
  this.technologyDescription = $.trim(technologyDescription);
}

function getData() {
  return $.getJSON(apiUrl);
}

const getLocation = (searchCity) => {
  const theProjects = [];
  if (searchCity.trim().length > 0) {
    citiesData.forEach((item) => {
      if (item.city.toLowerCase() === searchCity.toLowerCase().trim() || item.address.toLowerCase() === searchCity.toLowerCase().trim()) {
        theProjects.push(item);
      }
    });
  }
  return theProjects;
};

function AppViewModel() {
  const self = this;
  self.locations = ko.observable([]);
  self.alert = ko.observable();
  self.loader = ko.observable();
  self.data = ko.observable(false);
  self.loading = ko.observable('<center><br><div class="progress ligth"><div class="indeterminate" style="width: 50%"></div></div></center>');

  getData()
    .then((data) => {
      const locations = [];
      data.forEach((dataCity) => {
        locations.push(new Project(`<iframe width="100%" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox=${dataCity.Longitude}%2C${dataCity.Latitude}&amp;layer=mapnik&amp;marker=${dataCity.Latitude}%2C${dataCity.Longitude}" style="border: 1px solid black"></iframe>`, dataCity.Address, dataCity.AdditionalResources, dataCity.Discussion, dataCity.ContactEmailAddress, dataCity.ContactName, dataCity.ContactPhone, dataCity.City, dataCity.CountryName, dataCity.PostalCode, dataCity.ProjectName, dataCity.ProjectType, dataCity.Province, dataCity.Status, dataCity.TechnologyDescription));
      });
      self.data(true);
      self.loading('');
      citiesData = locations;
    })
    .catch(err => err);

  self.search = () => {
    self.loader('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
    self.locations('');
    self.alert('');
    const city = $('.city').val();
    const locations = getLocation(city);
    if (locations.length > 0) {
      self.alert('');
    } else if (locations.length === 0) {
      self.loader('');
      self.alert('Please enter valid city name or address');
    } else {
      setTimeout(() => {
        self.alert('Not found!');
      }, 2000);
    }
    setTimeout(() => {
      self.loader('');
      self.locations(locations);
    }, 2000);
  };
}

ko.applyBindings(new AppViewModel());