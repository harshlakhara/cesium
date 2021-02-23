import defaultValue from "../Core/defaultValue.js";
import defined from "../Core/defined.js";
import getJsonFromTypedArray from "../Core/getJsonFromTypedArray.js";
import getMagic from "../Core/getMagic.js";
import RuntimeError from "../Core/RuntimeError.js";
import Cesium3DTileContentType from "./Cesium3DTileContentType.js";

/**
 * Results of the preproces3DTileContent() function. This includes the
 * {@link Cesium3DTileContentType} and the payload. The payload is either
 * binary or JSON depending on the content type).
 *
 * @typedef {Object} PreprocessedContent
 * @property {Cesium3DTileContentType} contentType The type of the content
 * @property {Uint8Array} [binaryPayload] For binary files, the payload is returned as a typed array with byteOffset of 0
 * @property {Object} [jsonPayload] For JSON files, the results are returned as a JSON object.
 * @private
 */

/**
 * Preprocess a {@link Cesium3DTileContent}, to determine the type of content
 * and to parse JSON files into objects.
 *
 * @param {ArrayBuffer} arrayBuffer The raw binary payload
 * @return {PreprocessedContent}
 * @private
 */
export default function preproces3DTileContent(arrayBuffer) {
  var uint8Array = new Uint8Array(arrayBuffer);
  var contentIdentifier = getMagic(uint8Array);

  // We use glTF for JSON glTF files. For binary glTF, we rename this
  // to glb to disambiguate
  if (contentIdentifier === "glTF") {
    contentIdentifier = "glb";
  }

  if (Cesium3DTileContentType.isBinaryFormat(contentIdentifier)) {
    return {
      // For binary files, the enum value is the magic number
      contentType: contentIdentifier,
      binaryPayload: uint8Array,
    };
  }

  var json = getJsonContent(arrayBuffer, 0);
  if (defined(json.geometricError)) {
    // Most likely a tileset JSON
    return {
      contentType: Cesium3DTileContentType.EXTERNAL_TILESET,
      jsonPayload: json,
    };
  }

  if (defined(json.asset)) {
    // Most likely a glTF. Tileset JSON also has an "asset" property
    // so this check needs to happen second
    return {
      contentType: Cesium3DTileContentType.GLTF,
      jsonPayload: json,
    };
  }

  throw new RuntimeError("Invalid tile content.");
}

// TODO: is this needed anywhere else?
function getJsonContent(arrayBuffer, byteOffset) {
  byteOffset = defaultValue(byteOffset, 0);
  var uint8Array = new Uint8Array(arrayBuffer);
  var json;

  try {
    json = getJsonFromTypedArray(uint8Array);
  } catch (error) {
    throw new RuntimeError("Invalid tile content.");
  }

  return json;
}