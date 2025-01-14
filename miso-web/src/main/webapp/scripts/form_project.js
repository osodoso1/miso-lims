FormTarget = FormTarget || {};
FormTarget.project = (function ($) {
  /*
   * Expected config {
   *   statusOptions: array
   *   naming: {
   *     primary: {
   *       codeRequired: boolean
   *       codeMofifiable: boolean
   *     },
   *     secondary: { // optional
   *       codeRequired: boolean
   *       codeMofifiable: boolean
   *     }
   *   }
   * }
   */

  return {
    getUserManualUrl: function () {
      return Urls.external.userManual("projects");
    },
    getSaveUrl: function (project) {
      return project.id ? Urls.rest.projects.update(project.id) : Urls.rest.projects.create;
    },
    getSaveMethod: function (project) {
      return project.id ? "PUT" : "POST";
    },
    getEditUrl: function (project) {
      return Urls.ui.projects.edit(project.id);
    },
    getSections: function (config, object) {
      return [
        {
          title: "Project Information",
          fields: [
            {
              title: "Project ID",
              data: "id",
              type: "read-only",
              getDisplayValue: function (project) {
                return project.id || "Unsaved";
              },
            },
            {
              title: "Name",
              data: "name",
              type: "read-only",
              getDisplayValue: function (project) {
                return project.name || "Unsaved";
              },
            },
            {
              title: "Creation Date",
              data: "creationDate",
              type: "read-only",
            },
            {
              title: "Title",
              data: "title",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              title: "Use Secondary Naming Scheme",
              data: "secondaryNaming",
              type: "checkbox",
              include: !!config.naming.secondary && !object.id,
              onChange: function (newValue, form) {
                var scheme = config.naming[newValue ? "secondary" : "primary"];
                form.updateField("code", {
                  required: Constants.isDetailedSample || scheme.codeRequired,
                  disabled: !scheme.codeModifiable,
                });
              },
            },
            {
              title: "Use Secondary Naming Scheme",
              data: "secondaryNaming",
              type: "read-only",
              include: !!config.naming.secondary && object.id,
              getDisplayValue: function (project) {
                return project.secondaryNaming ? "Yes (Secondary)" : "No (Primary)";
              },
            },
            {
              title: "Code",
              data: "code",
              type: "text",
              maxLength: 255,
              required: Constants.isDetailedSample || config.naming.primary.codeRequired,
              disabled: !config.naming.primary.codeModifiable,
            },
            {
              title: "REB Number",
              description: "Research ethics board approval number",
              data: "rebNumber",
              type: "text",
              maxLength: 50,
            },
            {
              title: "REB Expiry",
              description: "Expiry date of research ethics board approval",
              data: "rebExpiry",
              type: "date",
            },
            {
              title: "Description",
              data: "description",
              type: "text",
              maxLength: 255,
            },
            {
              title: "Additional Details",
              data: "additionalDetails",
              type: "textarea",
              description: "Long text field, can be more in-depth than the 'Description' field",
              regex: "^[^<>]*$",
              maxLength: 65535,
            },
            {
              title: "Status",
              data: "status",
              type: "dropdown",
              required: true,
              source: config.statusOptions,
            },
            {
              title: "Reference Genome",
              data: "referenceGenomeId",
              type: "dropdown",
              required: "true",
              source: Constants.referenceGenomes,
              sortSource: Utils.sorting.standardSortWithException("alias", "Unknown", true),
              getItemLabel: function (item) {
                return item.alias;
              },
              getItemValue: function (item) {
                return item.id;
              },
            },
            {
              title: "Default Targeted Sequencing",
              data: "defaultTargetedSequencingId",
              type: "dropdown",
              source: Constants.targetedSequencings,
              sortSource: Utils.sorting.standardSort("alias"),
              getItemLabel: function (item) {
                return item.alias;
              },
              getItemValue: function (item) {
                return item.id;
              },
            },
            {
              title: "Pipeline",
              data: "pipelineId",
              type: "dropdown",
              source: Constants.pipelines,
              getItemLabel: Utils.array.getAlias,
              getItemValue: Utils.array.getId,
              sortSource: Utils.sorting.standardSort("alias"),
              required: true,
              nullLabel: "(Choose)",
            },
            {
              title: "Deliverable",
              data: "deliverableId",
              type: "dropdown",
              source: config.deliverables,
              getItemLabel: function (item) {
                return item.name;
              },
              getItemValue: function (item) {
                return item.id;
              },
            },
            {
              title: "Samples Expected",
              data: "samplesExpected",
              type: "int",
              min: 1,
            },
          ],
        },
      ];
    },
    confirmSave: function (object, isDialog, form) {
      object.assayIds = Project.getAssays().map(function (x) {
        return x.id;
      });
      object.contacts = Project.getContacts();
    },
  };

  function makeButton(text, callback) {
    return $("<button>")
      .addClass("ui-state-default")
      .attr("type", "button")
      .css("margin-left", "4px")
      .text(text)
      .click(callback);
  }
})(jQuery);
