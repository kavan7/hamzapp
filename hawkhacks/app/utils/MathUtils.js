/**

 * Calculate the angle between three points A, B, and C.
 * @param {Object} A - The first point {x: number, y: number}
 * @param {Object} B - The second point (vertex) {x: number, y: number}
 * @param {Object} C - The third point {x: number, y: number}
 * @returns {number} - The angle in degrees
 */
export function calculateAngle(A, B, C) {
    const AB = { x: B.x - A.x, y: B.y - A.y };
    const BC = { x: C.x - B.x, y: C.y - B.y };
  
    const dotProduct = AB.x * BC.x + AB.y * BC.y;
    const magnitudeAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
    const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);
  
    const cosTheta = dotProduct / (magnitudeAB * magnitudeBC);
  
    // To prevent floating point precision errors from causing NaN results from acos
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
    const angleDeg = (angleRad * 180) / Math.PI;
  
    return angleDeg;
  }
  