'use strict';

angular.module('doc.version', [
  'doc.version.interpolate-filter',
  'doc.version.version-directive'
])

.value('version', '0.1');
