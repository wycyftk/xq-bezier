const NO_SLOPE = 'no_slope' // 没有斜率
const ANGLE_0 = 0 // 0度
const ANGLE_90 = 90 // 90度
const ANGLE_180 = 180 // 180度
const ANGLE_270 = 270 // 360度

/**
 * 杨辉三角计算
 * @param n 三角的阶数
 */
export const yanghuiTriangle = (n) => {
  const triangle = new Array(n).fill(1);

  for (let i = 0; i < n; i++) {
    for (let j = i; j >= 0; j--) {
      if (j < i && j > 0) {
        triangle[j] += triangle[j - 1];
      }
    }
  }
  return triangle;
};

/**
 *
 * @param poss 贝塞尔曲线控制点坐标
 * @param precision 精度，需要计算的贝塞尔曲线上的点的数目
 */
export const bezierCalculate = (poss, precision) => {
  if (poss.length < 2) {
    console.error("贝塞尔曲线控制点数不能少于2个");
    return;
  }

  const number = poss.length;
  const result = new Array(precision).fill(0).map(_ => {
    return [0, 0]
  })

  const ks = yanghuiTriangle(number);

  for (let i = 0; i < precision; i++) {
    let t = i / precision;
    for (let j = 0; j < poss[0].length; j++) {
      let temp = 0;
      for (let k = 0; k < number; k++) {
        temp +=
          Math.pow(1 - t, number - k - 1) * poss[k][j] * Math.pow(t, k) * ks[k];
      }
      result[i][j] = temp;
    }
  }

  return result;
};

/**
 * 计算两点的斜率
 * @param x1 x1的x坐标
 * @param y1 x1的y坐标
 * @param x2 x2的x坐标
 * @param y2 x2的y坐标
 */
export const calcSlope = (x1, y1, x2, y2) => {
  if (x1 === x2) {
    if (y1 === y2) {
      console.error('invaild data')
      return undefined
    }
    return NO_SLOPE
  } else {
    return (y2 - y1) / (x2 - x1) 
  }
}

/**
 * 计算 线段x1x2 与 y轴的夹角
 *             |
 *             | 
 *       左上   | 右上
 * ------------╋----------> x轴（起点）
 *             |
 *       左下   | 右下
 *             v
 *             y轴
 * @param x1 x1的x坐标
 * @param y1 x1的y坐标
 * @param x2 x2的x坐标
 * @param y2 x2的y坐标
 * @return 夹角的值，取值范围 0 - 360，单位 deg
 */
export const calcAngle = (x1 , y1, x2, y2) => {
  const k = calcSlope(x1, y1, x2, y2)

  if (typeof k === 'undefined') return
  
  if (k === NO_SLOPE) {
    if (y2 > y1) {
      return ANGLE_90
    } else {
      return ANGLE_270
    }
  } else if (k === 0) {
    if (x2 > x1) {
      return ANGLE_0
    } else {
      return ANGLE_180
    }
  } else {
    const atanVal = Math.atan(k)
    // 顺时针90度方向是起点
    if (x2 > x1 && y2 > y1) {
      // 右下
      return atanVal / Math.PI * 180
    } else if (x2 > x1 && y2 < y1) {
      // 右上
      return atanVal / Math.PI * 180 + 360
    } else if (x2 < x1 && y2 < y1) {
      // 左上
      return atanVal / Math.PI * 180 + 180
    } else {
      // 左下
      return atanVal / Math.PI * 180 + 180
    }
  }
}

/**
 * 计算 线段x1x2 与 y轴的夹角对应的弧度
 *             |
 *             | 
 *       左上   | 右上
 * ------------╋----------> x轴（起点）
 *             |
 *       左下   | 右下
 *             v
 *             y轴
 * @param x1 x1的x坐标
 * @param y1 x1的y坐标
 * @param x2 x2的x坐标
 * @param y2 x2的y坐标
 * @return 夹角的弧度
 */
export const calcRadian = (x1 , y1, x2, y2) => {
  const angle = calcAngle(x1, y1, x2, y2)
  return angle / 180 * Math.PI
}

/**
 * 计算点之间的斜率
 * @returns 斜率
 */
export function calcSlopeBetweenPoints(points) {
  const result = []
  for (let i = 0; i < points.length - 1; i++) {
    result.push(calcSlope(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]))
  }
  return result
}

/**
 * 计算连续两点的线与x轴正向的夹角
 * @returns 斜率
 */
export function calcAngleBetweenPoints(points) {
  const result = []
  for (let i = 0; i < points.length - 1; i++) {
    result.push(calcAngle(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]))
  }
  return result
}

/**
 * 计算连续两点的线与x轴正向的夹角的弧度
 * @returns 斜率
 */
 export function calcRadianBetweenPoints(points) {
  const result = []
  for (let i = 0; i < points.length - 1; i++) {
    result.push(calcRadian(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]))
  }
  return result
}
