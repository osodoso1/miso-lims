if (typeof FormTarget === "undefined") {
  FormTarget = {};
}
FormTarget.assay = (function () {
  /*
   * Expected config {
   *   isAdmin: boolean
   * }
   */

  return {
    getUserManualUrl: function () {
      return Urls.external.userManual("requisitions", "assays");
    },
    getSaveUrl: function (assay) {
      return assay.id ? Urls.rest.assays.update(assay.id) : Urls.rest.assays.create;
    },
    getSaveMethod: function (assay) {
      return assay.id ? "PUT" : "POST";
    },
    getEditUrl: function (assay) {
      return Urls.ui.assays.edit(assay.id);
    },
    getSections: function (config, object) {
      var editable = config.isAdmin && config.pageMode !== "view";
      return [
        {
          title: "Assay Information",
          fields: [
            FormUtils.makeIdField("Assay"),
            {
              title: "Alias",
              type: editable ? "text" : "read-only",
              data: "alias",
              required: true,
              maxLength: 50,
            },
            {
              title: "Version",
              type: config.isAdmin && config.pageMode == "create" ? "text" : "read-only",
              data: "version",
              required: true,
              maxLength: 50,
            },
            {
              title: "Description",
              type: editable ? "text" : "read-only",
              data: "description",
              maxLength: 255,
            },
            {
              title: "Archived",
              type: "checkbox",
              data: "archived",
              disabled: !editable,
            },
          ],
        },
        {
          title: "Turn-around Time Targets (Days)",
          fields: [
            makeTargetDaysField("Overall Case", "caseTargetDays", editable, true),
            makeTargetDaysField("Receipt/Inspection", "receiptTargetDays", editable, true),
            makeTargetDaysField(
              "Extraction",
              "extractionTargetDays",
              editable,
              Constants.isDetailedSample
            ),
            makeTargetDaysField(
              "Library Preparation",
              "libraryPreparationTargetDays",
              editable,
              true
            ),
            makeTargetDaysField(
              "Library Qualification",
              "libraryQualificationTargetDays",
              editable,
              true
            ),
            makeTargetDaysField(
              "Full-Depth Sequencing",
              "fullDepthSequencingTargetDays",
              editable,
              true
            ),
            makeTargetDaysField("Analysis Review", "analysisReviewTargetDays", editable, true),
            makeTargetDaysField("Release Approval", "releaseApprovalTargetDays", editable, true),
            makeTargetDaysField("Release", "releaseTargetDays", editable, true),
          ],
        },
      ];
    },
    confirmSave: function (object, isDialog, form) {
      object.tests = Assay.getTests();
      object.metrics = Assay.getMetrics();
    },
  };

  function makeTargetDaysField(title, field, editable, include) {
    return {
      title: title,
      type: editable ? "text" : "read-only",
      data: field,
      getDisplayValue: editable
        ? undefined
        : function (assay) {
            return assay[field] || "?";
          },
      min: 0,
      max: 365,
      include: include,
    };
  }
})();
