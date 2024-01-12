import Cartesian3 from "../Core/Cartesian3.js";
import DynamicAtmosphereLightingType from "./DynamicAtmosphereLightingType.js";

/**
 * Common atmosphere settings used by sky atmosphere, ground atmosphere, and fog.
 *
 * <p>
 * This class is not to be confused with {@link SkyAtmosphere}, which is responsible for rendering the sky.
 * </p>
 * <p>
 * Currently, these settings only apply to 3D Tiles and models, but will eventually affect the sky atmosphere and globe. See {@link https://github.com/CesiumGS/cesium/issues/11681|issue #11681}.
 * </p>
 * <p>
 * While the atmosphere settings affect the color of fog, see {@link Fog} to control how fog is rendered.
 * </p>
 *
 * @alias Atmosphere
 * @constructor
 *
 * @example
 * // Turn on dynamic atmosphere lighting using the sun direction
 * scene.atmosphere.dynamicLighting = Cesium.DynamicAtmosphereLightingType.SUNLIGHT;
 *
 * @example
 * // Turn on dynamic lighting using whatever light source is in the scene
 * scene.light = new Cesium.DirectionalLight({
 *   direction: new Cesium.Cartesian3(1, 0, 0)
 * });
 * scene.atmosphere.dynamicLighting = Cesium.DynamicAtmosphereLightingType.SCENE_LIGHT;
 *
 * @example
 * // Adjust the color of the atmosphere effects.
 * scene.atmosphere.hueShift = 0.4; // Cycle 40% around the color wheel
 * scene.atmosphere.brightnessShift = 0.25; // Increase the brightness
 * scene.atmosphere.saturationShift = -0.1; // Desaturate the colors
 *
 * @see SkyAtmosphere
 * @see Globe
 * @see Fog
 */
function Atmosphere() {
  /**
   * The intensity of the light that is used for computing the ground atmosphere color.
   *
   * @type {number}
   * @default 10.0
   */
  this.lightIntensity = 10.0;

  /**
   * The Rayleigh scattering coefficient used in the atmospheric scattering equations for the ground atmosphere.
   *
   * @type {Cartesian3}
   * @default Cartesian3(5.5e-6, 13.0e-6, 28.4e-6)
   */
  this.rayleighCoefficient = new Cartesian3(5.5e-6, 13.0e-6, 28.4e-6);

  /**
   * The Mie scattering coefficient used in the atmospheric scattering equations for the ground atmosphere.
   *
   * @type {Cartesian3}
   * @default Cartesian3(21e-6, 21e-6, 21e-6)
   */
  this.mieCoefficient = new Cartesian3(21e-6, 21e-6, 21e-6);

  /**
   * The Rayleigh scale height used in the atmospheric scattering equations for the ground atmosphere, in meters.
   *
   * @type {number}
   * @default 10000.0
   */
  this.rayleighScaleHeight = 10000.0;

  /**
   * The Mie scale height used in the atmospheric scattering equations for the ground atmosphere, in meters.
   *
   * @type {number}
   * @default 3200.0
   */
  this.mieScaleHeight = 3200.0;

  /**
   * The anisotropy of the medium to consider for Mie scattering.
   * <p>
   * Valid values are between -1.0 and 1.0.
   * </p>
   *
   * @type {number}
   * @default 0.9
   */
  this.mieAnisotropy = 0.9;

  /**
   * The hue shift to apply to the atmosphere. Defaults to 0.0 (no shift).
   * A hue shift of 1.0 indicates a complete rotation of the hues available.
   *
   * @type {number}
   * @default 0.0
   */
  this.hueShift = 0.0;

  /**
   * The saturation shift to apply to the atmosphere. Defaults to 0.0 (no shift).
   * A saturation shift of -1.0 is monochrome.
   *
   * @type {number}
   * @default 0.0
   */
  this.saturationShift = 0.0;

  /**
   * The brightness shift to apply to the atmosphere. Defaults to 0.0 (no shift).
   * A brightness shift of -1.0 is complete darkness, which will let space show through.
   *
   * @type {number}
   * @default 0.0
   */
  this.brightnessShift = 0.0;

  /**
   * When not DynamicAtmosphereLightingType.OFF, the selected light source will
   * be used for dynamically lighting all atmosphere-related rendering effects.
   *
   * @type {DynamicAtmosphereLightingType}
   * @default DynamicAtmosphereLightingType.OFF
   */
  this.dynamicLighting = DynamicAtmosphereLightingType.OFF;

  this.lightingFadeOutDistance = 1.0e7;
  this.lightingFadeInDistance = 2.0e7;
  this.nightFadeInDistance = 5.0e7;
  this.nightFadeOutDistance = 1.0e7;
}

Atmosphere.prototype.update = function (frameState) {
  const atmosphere = frameState.atmosphere;
  atmosphere.hsbShift.x = this.hueShift;
  atmosphere.hsbShift.y = this.saturationShift;
  atmosphere.hsbShift.z = this.brightnessShift;
  atmosphere.lightIntensity = this.lightIntensity;
  atmosphere.rayleighCoefficient = Cartesian3.clone(
    this.rayleighCoefficient,
    atmosphere.rayleighCoefficient
  );
  atmosphere.rayleighScaleHeight = this.rayleighScaleHeight;
  atmosphere.mieCoefficient = Cartesian3.clone(
    this.mieCoefficient,
    atmosphere.mieCoefficient
  );
  atmosphere.mieScaleHeight = this.mieScaleHeight;
  atmosphere.mieAnisotropy = this.mieAnisotropy;

  atmosphere.dynamicLighting = this.dynamicLighting;

  atmosphere.lightingFadeDistance.x = this.lightingFadeOutDistance;
  atmosphere.lightingFadeDistance.y = this.lightingFadeInDistance;
  atmosphere.nightFadeDistance.x = this.nightFadeOutDistance;
  atmosphere.nightFadeDistance.y = this.nightFadeInDistance;
};

export default Atmosphere;
