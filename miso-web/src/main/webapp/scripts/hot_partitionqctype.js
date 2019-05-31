HotTarget.partitionqctype = {
  createUrl: '/miso/rest/partitionqctypes',
  updateUrl: '/miso/rest/partitionqctypes/',
  requestConfiguration: function(config, callback) {
    callback(config)
  },
  fixUp: function(partitionqctype, errorHandler) {
  },
  createColumns: function(config, create, data) {
    return [HotUtils.makeColumnForText('Description', true, 'description', {
      validator: HotUtils.validator.requiredText
    }), HotUtils.makeColumnForBoolean('Note Required', true, 'noteRequired', true),
        HotUtils.makeColumnForBoolean('Order Fulfilled', true, 'orderFulfilled', true),
        HotUtils.makeColumnForBoolean('Analysis Skipped', true, 'analysisSkipped', true)];
  },

  getBulkActions: function(config) {
    return !config.isAdmin ? [] : [{
      name: 'Edit',
      action: function(items) {
        window.location = window.location.origin + '/miso/partitionqctype/bulk/edit?' + jQuery.param({
          ids: items.map(Utils.array.getId).join(',')
        });
      }
    }];
  }
};
