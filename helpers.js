module.exports = { 
  ifIn : function (list,property,element, options) {
    return list.some(item => item[property] == element )?  options.fn(this):options.inverse(this);
  },
  ifEquals : function (first,second, options) {
      return first == second ?  options.fn(this):options.inverse(this);
  },
}