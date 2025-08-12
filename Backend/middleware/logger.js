/**
 * Request logging middleware
 * Logs all incoming requests with method, URL, status code, and response time
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log the incoming request
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  
  // Log request body for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Request Body:`, JSON.stringify(req.body, null, 2));
  }
  
  // Log query parameters if any
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`🔍 Query Params:`, JSON.stringify(req.query, null, 2));
  }
  
  // Log URL parameters if any
  if (req.params && Object.keys(req.params).length > 0) {
    console.log(`📍 URL Params:`, JSON.stringify(req.params, null, 2));
  }
  
  // Override res.end to log the response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Color code based on status
    let statusColor = '🟢'; // Green for 2xx
    if (statusCode >= 400 && statusCode < 500) statusColor = '🟡'; // Yellow for 4xx
    if (statusCode >= 500) statusColor = '🔴'; // Red for 5xx
    
    console.log(`${statusColor} ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${statusCode} (${duration}ms)`);
    
    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * API usage statistics middleware
 * Tracks endpoint usage for analytics
 */
const apiStats = {
  requests: {},
  totalRequests: 0,
  startTime: new Date()
};

const statsLogger = (req, res, next) => {
  const endpoint = `${req.method} ${req.originalUrl}`;
  
  // Initialize endpoint stats if not exists
  if (!apiStats.requests[endpoint]) {
    apiStats.requests[endpoint] = {
      count: 0,
      lastUsed: null,
      avgResponseTime: 0,
      totalResponseTime: 0
    };
  }
  
  // Update stats
  apiStats.requests[endpoint].count++;
  apiStats.requests[endpoint].lastUsed = new Date();
  apiStats.totalRequests++;
  
  // Log stats every 10 requests
  if (apiStats.totalRequests % 10 === 0) {
    console.log('\n📊 API Usage Statistics:');
    console.log(`Total Requests: ${apiStats.totalRequests}`);
    console.log('Top Endpoints:');
    
    const sortedEndpoints = Object.entries(apiStats.requests)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);
    
    sortedEndpoints.forEach(([endpoint, stats]) => {
      console.log(`  ${endpoint}: ${stats.count} requests`);
    });
    console.log('');
  }
  
  next();
};

/**
 * Print API statistics
 */
const printApiStats = () => {
  console.log('\n📈 API Usage Report:');
  console.log(`Server Uptime: ${Math.floor((new Date() - apiStats.startTime) / 1000)} seconds`);
  console.log(`Total Requests: ${apiStats.totalRequests}`);
  console.log('\nEndpoint Breakdown:');
  
  Object.entries(apiStats.requests)
    .sort(([,a], [,b]) => b.count - a.count)
    .forEach(([endpoint, stats]) => {
      console.log(`  ${endpoint}: ${stats.count} requests`);
    });
  
  console.log('');
};

module.exports = {
  requestLogger,
  statsLogger,
  printApiStats,
  apiStats
};
