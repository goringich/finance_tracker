$(document).ready(function() {
  createPieCharts(data);
});

function createPieCharts(data) {
  var groupedData = groupDataByCategory(data);
  
  groupedData.forEach(function(categoryData, index) {
      var category = categoryData.category;
      var pieElementId = 'pie-' + index;
      var legendElementId = 'legend-' + index;

      $('.wrapper').append(
          '<div class="pie-chart--wrapper">' +
          '<h2>' + category + '</h2>' +
          '<div class="pie-chart">' +
          '<div class="pie-chart__pie" id="' + pieElementId + '"></div>' +
          '<ul class="pie-chart__legend" id="' + legendElementId + '"></ul>' +
          '</div>' +
          '</div>'
      );

      createPie('#' + pieElementId, '#' + legendElementId, categoryData.values);
  });
}

function groupDataByCategory(data) {
  var groupedData = {};
  data.forEach(function(item) {
      if (!groupedData[item.category]) {
          groupedData[item.category] = [];
      }
      groupedData[item.category].push({ label: item.label, count: item.count });
  });

  return Object.keys(groupedData).map(function(category) {
      return {
          category: category,
          values: groupedData[category]
      };
  });
}

function createPie(pieElementId, legendElementId, values) {
  var listData = [];
  var listTotal = 0;
  var offset = 0;
  var color = ["cornflowerblue", "olivedrab", "orange", "tomato", "crimson", "purple", "turquoise", "forestgreen", "navy"];
  color = shuffle(color);

  values.forEach(function(value, index) {
      listData.push(Number(value.count));
      $(legendElementId).append('<li><em>' + value.label + '</em><span>' + value.count + '</span></li>');
  });

  for (var i = 0; i < listData.length; i++) {
      listTotal += listData[i];
  }

  for (var i = 0; i < listData.length; i++) {
      var size = sliceSize(listData[i], listTotal);
      iterateSlices(pieElementId, size, offset, i, 0, color[i]);
      $(legendElementId + ' li:nth-child(' + (i + 1) + ')').css('border-color', color[i]);
      offset += size;
  }
}

function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function iterateSlices(pieElementId, sliceSize, offset, dataCount, sliceCount, color) {
  var maxSize = 179;
  var sliceID = 's' + dataCount + '-' + sliceCount;

  if (sliceSize <= maxSize) {
      addSlice(pieElementId, sliceSize, offset, sliceID, color);
  } else {
      addSlice(pieElementId, maxSize, offset, sliceID, color);
      iterateSlices(pieElementId, sliceSize - maxSize, offset + maxSize, dataCount, sliceCount + 1, color);
  }
}

function addSlice(pieElementId, sliceSize, offset, sliceID, color) {
  $(pieElementId).append('<div class="slice ' + sliceID + '"><span></span></div>');
  offset = offset - 1;
  var sizeRotation = -179 + sliceSize;

  $(pieElementId + ' .' + sliceID).css({
      'transform': 'rotate(' + offset + 'deg) translate3d(0,0,0)'
  });

  $(pieElementId + ' .' + sliceID + ' span').css({
      'transform': 'rotate(' + sizeRotation + 'deg) translate3d(0,0,0)',
      'background-color': color
  });
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
  }
  return a;
}