/**
 * Converts to port format of the Hub backend to match the one used in webapps-common
 * @param {Object} port { dataType: String, objectClass?: String, color: String }
 * @returns {Object} { dataType: String, typeName: String, color?: String}
 */
export default (port) => {
  // make a copy
  port = { ...port };

  // typeName is the human readable form of the data type
  port.typeName = port.dataType === "Data" ? "Table" : port.dataType;

  // Make type one of ['table', 'flowVariable', 'other']
  if (port.objectClass) {
    // Determine type based on the object class (which is an identifier instead of a label)
    // not available in search results
    port.type =
      {
        "org.knime.core.node.BufferedDataTable": "table",
        "org.knime.core.node.port.flowvariable.FlowVariablePortObject":
          "flowVariable",
      }[port.objectClass] || "other";
  } else {
    port.type =
      {
        Data: "table",
        "Flow Variable": "flowVariable",
      }[port.dataType] || "other";
  }

  delete port.dataType;
  delete port.objectClass;

  // If type is table or flowVariable, it doesn't need color, otherwise prepend '#' to the hex-value
  if (port.type === "other") {
    port.color = `#${port.color}`;
  } else {
    delete port.color;
  }

  return port;
};
