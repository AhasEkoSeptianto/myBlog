exports.ValidatePagination = (obj_data) => {
    let { page, limit } = obj_data;
    page = parseInt(page);
    limit = parseInt(limit);
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    var results = {}
    if (startIndex > 0) {
      results.previous = {
        limit: limit,
        page: page - 1,
      };
    }
  
    if (endIndex < results.totalNumber) {
      results.next = {
        limit: limit,
        page: page + 1,
      };
    }
  
    let result = { ...obj_data, page: startIndex < 1 ? 0 : startIndex , limit: limit };
    return result;
  };
  