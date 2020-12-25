import { type } from './index'
import {point, line, polygon} from '../constant/type'


export const calcVector = (point: point) => {
  point = { ...point }

  let abs = point.x * point.y < 0 ? Math.abs(point.x - point.y) : point.x + point.y
  let z = 1 / abs
  point.x = point.x * z
  point.y = point.y * z

  return point
}

/**
 * 计算直线向量
 * @param {*} line 
 */
export const strictLineVector = (line: line): point => {
  let cpoint = {
    x: line[1].x - line[0].x,
    y: line[1].y - line[0].y
  }
  let xd = Math.abs(cpoint.x / 1)
  let yd = Math.abs(cpoint.y / 1)
  let js = xd > yd ? xd : yd
  let verctor = { x: cpoint.x / js, y: cpoint.y / js }
  // verctor.x = Math.abs(verctor.x) < 0.01 ? 0 : verctor.x
  // verctor.y = Math.abs(verctor.y) < 0.01 ? 0 : verctor.y

  return calcVector(verctor)
}

/**
 * 计算直线向量
 * @param {*} line 
 */
export const lineVector = (line: line, jq: number = 0.001): point => {
  let verctor = strictLineVector(line)

  if (Math.abs(verctor.x) < jq) verctor.x = 0
  if (Math.abs(verctor.y) < jq) verctor.y = 0

  return verctor
}

/**
 * 计算垂直向量
 */
export const verticalLine = (line: line): point => {
  let { x, y } = lineVector(line)
  if (x - y !== 0) {
    let verctor = {
      x: y / (y - x),
      y: x / (x - y)
    }
    return calcVector(verctor)
  } else {
    return { x, y }
  }
}

/**
 * 计算直线长度
 * @param line 
 */
export const lineDis = (line: line): number => {
  return Number(
    Math.sqrt(
      Math.pow(line[0].x - line[1].x, 2) +
      Math.pow(line[0].y - line[1].y, 2)
    ).toFixed(4)
  )
}


/**
 * 求线段的中心点坐标
 * @param line 
 */
export const lineCenter = (line: line): point => ({
  x: (line[0].x + line[1].x) / 2,
  y: (line[0].y + line[1].y) / 2,
})


/**
 * 求两线段交点坐标
 * @param {*} line1 
 * @param {*} line2 
 */
export const segmentsIntr = (line1: line, line2: line): point | false => {
  let [a, b] = line1
  let [c, d] = line2
  /** 1 解线性方程组, 求线段交点. **/
  // 如果分母为0 则平行或共线, 不相交  
  let denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
  if (denominator == 0) return false;

  // 线段所在直线的交点坐标 (x , y)      
  let x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
    + (b.y - a.y) * (d.x - c.x) * a.x
    - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
  let y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
    + (b.x - a.x) * (d.y - c.y) * a.y
    - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

  if (isContainPoint(line1, { x, y }) && isContainPoint(line2, { x, y })) {
    return { x, y }
  } else {
    return false
  }
}


/**
 * 求两线段交点坐标,如果没有则延长
 * @param {*} line1 
 * @param {*} line2 
 */
export const segmentsIntrFine = (line1: line, line2: line): point | false => {
  let [a, b] = line1
  let [c, d] = line2
  /** 1 解线性方程组, 求线段交点. **/
  // 如果分母为0 则平行或共线, 不相交  
  let denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
  if (denominator == 0) return false;

  // 线段所在直线的交点坐标 (x , y)      
  let x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
    + (b.y - a.y) * (d.x - c.x) * a.x
    - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
  let y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
    + (b.x - a.x) * (d.y - c.y) * a.y
    - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

  if (isNaN(x) || isNaN(y)) {
    return false
  }

  return { x, y }
}

/**
 * 点到直线的距离
 */
export const pointLineDis = (line: line, point: point): number => {
  let dis = 0
  let s1 = line[1].x - line[0].x
  let s2 = point.x - line[0].x
  let s3 = point.x - line[1].x
  let k1 = line[1].y - line[0].y
  let k2 = point.y - line[0].y
  let k3 = point.y - line[1].y
  let cross = s1 * s2 + k1 * k2;
  let d2 = s1 * s1 + k1 * k1;

  if (cross <= 0) {
    dis = Math.sqrt(s2 * s2 + k2 * k2);
  } else if (cross >= d2) {
    dis = Math.sqrt(s3 * s3 + k3 * k3);
  } else {
    let r = cross / d2;
    let px = line[0].x + s1 * r;
    let py = line[0].y + k1 * r;
    dis = Math.sqrt((point.x - px) * (point.x - px) + (py - point.y) * (py - point.y));
  }

  return dis
}

/**
 * 判断点是否在线上
 * @param {*} point 要判断的点
 * @param {*} line 线段
 * @param {*} width 线宽
 */
export const isContainPoint = (line: line, point: point): boolean => {
  return !Math.abs(pointLineDis(line, point)) || Math.abs(pointLineDis(line, point)) < 0.05
}


/**
 * 获取一个指定X或Y在线段垂直中的点
 * @param {*} line 哪条线
 * @param {*} point X|Y数值
 */
export const getVerLinePoint = (line: line, _point: { x: number } | { y: number } | point): point => {
  return getVectorPosPoint(verticalLine(line), line[0], _point)
}

/**
 * 获取一个指定X或Y在线段矢量中的点
 * @param verctor 
 * @param point 
 * @param _point 
 */
export const getVectorPosPoint = (verctor: point, point: point, _point: { x: number } | { y: number } | point): point => {
  return getLinePoint(
    [
      point,
      {
        x: point.x + verctor.x * 10000,
        y: point.y + verctor.y * 10000
      }
    ], 
    _point
  )
}


/**
 * 获取一个指定X或Y在线段中的点
 * @param {*} line 哪条线
 * @param {*} point X|Y数值
 */
export const getLinePoint = (line: line, _point: { x: number } | { y: number } | point): point => {
  let point = _point as point
  if (type.isNumber(point.x) && type.isNumber(point.y)) {
    let { x, y } = lineVector(line)
    let attr = Math.abs(x) > Math.abs(y) ? 'x' : 'y'
    point = { [attr]: point[attr] } as point
  }
  let newV = lineVector(line, 0.0001)
  let k = newV.y / newV.x
  let b = line[0].y - k * line[0].x

  if (k > 100 || k < -100) return { x: line[0].x, y: point.y }

  return type.isNumber(point.x) ?
    { x: point.x, y: k * point.x + b } :
    type.isNumber(point.y) ?
      { x: (point.y - b) / k, y: point.y } :
      { x: 0, y: 0 }
}

/**
 * 获取点在线段固定X或Y位置
 * @param line 哪条线
 * @param point 
 */
export const getFlexLinePoint = (line: line, point: point): point => {
  let { x, y } = strictLineVector(line)
  x = Math.abs(x)
  y = Math.abs(y)

  let move = x > y ? { x: point.x } : { y: point.y }

  return getLinePoint(line, move)
}

/**
 * 获取向量距离起点dis距离的点坐标
 * @param {*} line 向量
 * @param {*} startPoint 起点
 * @param {*} dis 距离
 * @returns [point, point] 位置点  两边延申所以有两个
 */
export const getDisVectorPoints = (lv: point, startPoint: point, dis: number): line => {
  let F = Math.atan(lv.y / lv.x)
  return [
    {
      x: startPoint.x + dis * Math.cos(F),
      y: startPoint.y + dis * Math.sin(F),
    }, {
      x: startPoint.x + -dis * Math.cos(F),
      y: startPoint.y + -dis * Math.sin(F),
    }
  ]
}

/**
 * 获取直线距离指定起点dis距离的点坐标
 * @param {*} line 直线
 * @param {*} startPoint 起点
 * @param {*} dis 距离
 * @returns [point, point] 位置点  两边延申所以有两个
 */
export const getDisPointLinePoints = (line: line, startPoint: point, dis: number): line => getDisVectorPoints(lineVector(line), startPoint, dis)

/**
 * 获取直线距离起点dis距离的点坐标
 * @param {*} line 直线
 * @param {*} dis 距离
 * @returns Point
 */
export const getLineDisPoint = (line: line, dis: number): point => {
  let [p1, p2] = getDisPointLinePoints(line, line[0], dis)
  let lv = lineVector(line)
  let v1 = lineVector([line[0], p1])

  return lv.x * v1.x >= 0 && lv.y * v1.y >= 0 ? p1 : p2
}


/**
 * 获取直线距离指定位置dis距离的点坐标
 * @param {*} line 直线
 * @param {*} dis 距离
 * @returns Point
 */
export const getLineDisSelectPoint = (line: line, point: point, dis: number): point => {
  let [p1, p2] = getDisPointLinePoints(line, point, dis)

  if (isContainPoint(line, p1)) {
    return p1
  } else {
    return p2
  }
}

/**
 * 获取直线垂直线距离起点dis距离的点坐标
 * @param {*} line 直线
 * @param {*} startPoint 起点
 * @param {*} dis 距离
 */
export const getDisVerticalLinePoints = (line: line, startPoint: point, dis: number): line => getDisVectorPoints(verticalLine(line), startPoint, dis)


/**
 * 获取直线垂直线距离起点dis距离的点坐标，去距离较近
 * @param {*} line 直线
 * @param {*} startPoint 起点
 * @param {*} dis 距离
 */
export const getTargetDisVerticalLinePoints = (line: line, startPoint: point, dis: number, target: point): point => {
  let [p1, p2] = getDisVectorPoints(verticalLine(line), startPoint, dis)
  return lineDis([p1, target]) > lineDis([p2, target]) ? p2 : p1
}

/**
 * 获取直线垂直距离交接点dis距离的点坐标
 * @param line 直线
 * @param vline 交界线
 * @param dis 距离
 */
export const getLineVerticalChangePoint = (line: line, vline: line, dis: number): point | false => {
  let point = segmentsIntrFine(line, vline)
  if (!point) {
    return point
  } else {
    return getLineVerticalPoint(line, point, lineVector(vline), dis)
  }
}


/**
 * 获取直线垂直距离七点dis距离的点坐标，
 * @param line 直线
 * @param point 起点
 * @param lv 垂直线矢量坐标
 * @param dis 距离
 */
export const getLineVerticalPoint = (line: line, point: point, lv: point, dis: number): point => {
  let [p1, p2] = getDisVerticalLinePoints(line, point, dis)
  let v1 = lineVector([point, p1])
  let v2 = lineVector([point, p2]);

  let v1x = lv.x * v1.x
  let v1y = lv.y * v1.y
  let v2x = lv.x * v2.x
  let v2y = lv.x * v2.y

  if (v1x >= 0 && v1y >= 0) {
    return p1
  } else if (v2x >= 0 && v2y >= 0) {
    return p2
  } else {
    let t1 = v1x < v1y ? v1x : v1y
    let t2 = v2x < v2y ? v2x : v2y

    if (t1 < t2) {
      return p2
    } else {
      return p1
    }
  }
}

// 获取一个坐标在哪个象限
export const getPointCoordinate = (point: point): number => {
  return point.x >= 0 && point.y >= 0 ? 1 :
    point.x >= 0 && point.y <= 0 ? 2 :
      point.x <= 0 && point.y <= 0 ? 3 :
        point.x <= 0 && point.y >= 0 ? 4 : 0
}



// 获取一个坐标在哪个象限
export const getLineCoordinate = (line: line): number => {
  let point = {
    x: line[1].x - line[0].x,
    y: line[1].y - line[0].y
  }
  if (point.x >= 0 && point.y >= 0) {
    return 1
  } else if (point.x >= 0 && point.y <= 0) {
    return 4
  } else if (point.x <= 0 && point.y <= 0) {
    return 3
  } else {
    return 2
  }
}


// 获取两个坐标象限差距
export const getPointCoordDistance = (point1: point, point2: point): number => getPointCoordinate(point1) - getPointCoordinate(point2)




/**
 * 计算多边形的面积
 * @param {*} points 
 */
export const faceArea = (points: polygon) => {
  let point_num = points.length

  if (point_num < 3) {
    return 0
  }

  let s = points[0].y * (points[point_num - 1].x - points[1].x);

  for (let i = 1; i < point_num; ++i)
    s += points[i].y * (points[i - 1].x - points[(i + 1) % point_num].x);

  return Math.abs(s / 2);
}


/**
 * 判断一个点是否在面上
 * @param {*} face1 
 * @param {*} face2 
 */
export const pointInside = (face: polygon, point: point) => {
  var inside = false;
  var x = point.x,
    y = point.y;

  for (var i = 0, j = face.length - 1; i < face.length; j = i++) {
    var xi = face[i].x,
      yi = face[i].y;
    var xj = face[j].x,
      yj = face[j].y;

    if (((yi > y) != (yj > y)) &&
      (x <= (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  // if (!inside) {
  //   inside = face.some((p, i) => {
  //     let next = i === face.length - 1 ? 0 : i+1
  //     return isContainPoint({points: [face[i], face[next]]}, point)
  //   })
  // }

  return inside;
}


/**
 * 判断一个点是否在面线上
 * @param {*} face1 
 * @param {*} face2 
 */
export const pointInsideBorder = (face: polygon, point: point) => {
  for (let i = 0; i < face.length; i++) {
    let current = [
      face[i],
      face[i === face.length - 1 ? 0 : i + 1]
    ] as line

    if (isContainPoint(current, point)) {
      return true
    }
  }
  return false
}


export const isClockWise = (points: polygon, isYAxixToDown = true) => {
  let i, j, k;
  let count = 0;
  let z;
  let yTrans = isYAxixToDown ? (-1) : (1);
  if (points == null || points.length < 3) {
    return false;
  }

  let n = points.length;
  for (i = 0; i < n; i++) {
    j = (i + 1) % n;
    k = (i + 2) % n;
    z = (points[j].x - points[i].x) * (points[k].y * yTrans - points[j].y * yTrans);
    z -= (points[j].y * yTrans - points[i].y * yTrans) * (points[k].x - points[j].x);
    if (z < 0) {
      count--;
    } else if (z > 0) {
      count++;
    }
  }
  return count > 0
}



/**
 * 判断两条线段是否相交
 * @param {*} line1 
 * @param {*} line2 
 */
export const isLineIntersect = (line1: line, line2: line): boolean => {
  var a1 = line1[1].y - line1[0].y;
  var b1 = line1[0].x - line1[1].x;
  var c1 = a1 * line1[0].x + b1 * line1[0].y;
  //转换成一般式: Ax+By = C
  var a2 = line2[1].y - line2[0].y;
  var b2 = line2[0].x - line2[1].x;
  var c2 = a2 * line2[0].x + b2 * line2[0].y;
  // 计算交点		
  var d = a1 * b2 - a2 * b1;

  // 当d==0时，两线平行
  if (d == 0) {
    return false;
  } else {
    var x = (b2 * c1 - b1 * c2) / d;
    var y = (a1 * c2 - a2 * c1) / d;

    // 检测交点是否在两条线段上
    if ((isInBetween(line1[0].x, x, line1[1].x) || isInBetween(line1[0].y, y, line1[1].y)) &&
      (isInBetween(line2[0].x, x, line2[1].x) || isInBetween(line2[0].y, y, line2[1].y))) {
      return true;
    }
  }

  function isInBetween(a, b, c) {
    // 如果b几乎等于a或c，返回false.为了避免浮点运行时两值几乎相等，但存在相差0.00000...0001的这种情况出现使用下面方式进行避免

    if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) {
      return false;
    }

    return (a <= b && b <= c) || (c <= b && b <= a);
  }

  return false;
}


/**
 * 判断两个面是否相交, 
 * @param {*} face1 
 * @param {*} face2 
 */
export const isFaceIntersect = (face1: polygon, face2: polygon): boolean => {
  for (var i = 0; i < face1.length; i++) {
    var next = i + 1 === face1.length ? 0 : i + 1
    var line1: line = [face1[i], face1[next]]

    for (var j = 0; j < face2.length; j++) {
      var next = j + 1 === face2.length ? 0 : j + 1
      var line2: line = [face2[j], face2[next]]
      var isIntersect1 = isLineIntersect(line2, line1)
      var isIntersect2 = isLineIntersect(line1, line2)

      if (isIntersect1 && isIntersect2) {
        return true
      }
    }
  }
  return false
}


/**
 * 判断两个面是否包含
 * @param {*} face1 大多边形
 * @param {*} face2 小多边形
 */
export const isFaceContain = (face1: polygon, face2: polygon): boolean => {
  return face2.every(point => pointInside(face1, point)) && !isFaceIntersect(face1, face2)
}



/**
 * 判断两个面是否包含
 * @param {*} face1 父
 * @param {*} face2 子
 */
export const isFaceChild = (face1: polygon, face2: polygon): boolean => {
  return face2.every(point => pointInside(face1, point) || pointInsideBorder(face1, point)) && !isFaceIntersect(face1, face2)
}


/**
 * 计算多边形的中心点
 * @param {*} points 
 */
export const faceCenter = (points: polygon): point => {
  var x = 0.0;
  var y = 0.0;
  for (var i = 0; i < points.length; i++) {
    x += points[i].x;
    y += points[i].y;
  }
  x = x / points.length;
  y = y / points.length;

  return { x: x, y: y }
}


// 直线向两端伸展
export const lineStretch = (line: line, val: number): line => {
  line = line.map(point => ({ x: point.x, y: point.y })) as line
  let center = lineCenter(line)
  let [p1, p2] = getDisPointLinePoints(line, center, val / 2)

  if (lineDis([line[0], p1]) > lineDis([line[0], p2])) {
    line[0].x = p2.x
    line[0].y = p2.y
    line[1].x = p1.x
    line[1].y = p1.y
  } else {
    line[0].x = p1.x
    line[0].y = p1.y
    line[1].x = p2.x
    line[1].y = p2.y
  }
  return line
}

// 获取两条直线的角度
export const getAngle = (line1: line, line2: line): number => {
  let point = segmentsIntr(line1, line2)
  if (!point) return 0

  // let p1 = line1.points[0].x > point.x ? line1.points[0] : line1.points[1]
  // let p2 = line2.points[0].x > point.x ? line2.points[1] : line2.points[0]
  let p1 = line1[0]
  let p2 = line2[1]

  let x1 = p1.x - point.x
  let y1 = p1.y - point.y
  let x2 = p2.x - point.x
  let y2 = p2.y - point.y
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  let angle = Math.atan2(det, dot)

  // if (angle < 0) {
  //   angle = Math.abs(angle)
  // }

  return angle
}

//若点point1大于点point2,即点point1在点point2顺时针方向,返回true,否则返回false
export const PointCmp = (a: point, b: point, center: point): boolean => {
  if (Math.abs(a.x - b.x) < 0.02) {
    b = { ...b, x: a.x }
  }

  if (Math.abs(a.y - b.y) < 0.02) {
    b = { ...b, x: a.y }
  }


  if (a.x >= 0 && b.x < 0) return true;
  if (a.x == 0 && b.x == 0) return a.y > b.y;

  let det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
  if (det < 0)
    return true;
  if (det > 0)
    return false;

  //向量OA和向量OB共线，以距离判断大小
  let d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
  let d2 = (b.x - center.x) * (b.x - center.y) + (b.y - center.y) * (b.y - center.y);
  return d1 > d2;
}

export const clockwiseSorting = (points: polygon, basic: number): polygon => {
  points = points.map(p => ({ ...p }))

  for (let i = 0; i < points.length; i++) {
    let a = points[i]
    a.x = Number(a.x.toFixed(2))
    a.y = Number(a.y.toFixed(2))

    for (let j = i + 1; j < points.length; j++) {
      let b = points[j]
      b.x = Number(b.x.toFixed(2))
      b.y = Number(b.y.toFixed(2))

      if (Math.abs(a.x - b.x) < 0.02) {
        points[j] = { ...b, x: a.x }
      }

      if (Math.abs(a.y - b.y) < 0.02) {
        points[j] = { ...b, y: a.y }
      }
    }
  }

  var base = Math.atan2(points[basic].y, points[basic].x);
  return points.sort(function (a, b) {
    return Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x) + (Math.atan2(b.y, b.x) > base ? - 2 * Math.PI : 0) + (Math.atan2(a.y, a.x) > base ? 2 * Math.PI : 0);
  });
}

// 将无序的点坐标变成顺时针排序
export const clockwiseSortPoints = (points: polygon): polygon => {
  let x = 0, y = 0;
  points = [...points]
  points.forEach(p => {
    x += p.x
    y += p.y
  })

  let center = {
    x: x / points.length,
    y: y / points.length
  }

  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < points.length; j++) {
      if (j < points.length - 1) {
        if (PointCmp(points[j], points[j + 1], center)) {
          let tmp = points[j];
          points[j] = points[j + 1];
          points[j + 1] = tmp;
        }
      } else {
        if (PointCmp(points[j], points[0], center)) {
          let tmp = points[j];
          points[j] = points[0];
          points[0] = tmp;
        }
      }
    }
  }

  return points;
}


export const lineDeg= (line: line) => {
  return Math.atan2(line[1].y - line[0].y, line[1].x - line[0].x) * 180 / Math.PI
}