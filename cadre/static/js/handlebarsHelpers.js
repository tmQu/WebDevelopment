import Handlebars from 'handlebars';

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  }

  var operators = {
    '==': function (l, r) {
      return l == r;
    },
    '===': function (l, r) {
      return l === r;
    },
    '!=': function (l, r) {
      return l != r;
    },
    '!==': function (l, r) {
      return l !== r;
    },
    '<': function (l, r) {
      return l < r;
    },
    '>': function (l, r) {
      return l > r;
    },
    '<=': function (l, r) {
      return l <= r;
    },
    '>=': function (l, r) {
      return l >= r;
    },
    typeof: function (l, r) {
      return typeof l == r;
    },
  };

  if (!operators[operator]) {
    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
  }

  var result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
Handlebars.registerHelper('paginate', function (currentPage, pageCount, options) {
    let start = currentPage - 2;
    if (start < 1) start = 1;
    let end = start + 4;
    if (end > pageCount) {
      end = pageCount;
      start = end - 4;
      if (start < 1) start = 1;
    }
  
    let result = '';
    for (let i = start; i <= end; i++) {
      result += options.fn({ number: i });
    }
  
    return new Handlebars.SafeString(result); // Sử dụng Handlebars.SafeString để tránh lỗi
  });
  
Handlebars.registerHelper('containsLocationCategory', function(locationCategories, categoryToCheck) {
  if (locationCategories)
    return locationCategories.some(function(locationCategory) {
      return locationCategory.locationCategory === categoryToCheck;
    });
  else
    return false
});

Handlebars.registerHelper('partial', function (name, context) {
  var partial = Handlebars.partials[name];
  if (typeof partial === 'undefined') {
    return 'Partial not found';
  }
  return partial(context);
});

Handlebars.registerHelper('partial', function (name, context) {
  var partial = Handlebars.partials[name];
  if (typeof partial === 'undefined') {
    return 'Partial not found';
  }
  return partial(context);
});
  

export default { compare: Handlebars.helpers.compare, paginate: Handlebars.helpers.paginate, containsLocationCategory: Handlebars.helpers.containsLocationCategory, partial: Handlebars.helpers.partial};
