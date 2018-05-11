module.exports = {
  string: () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    let numbers = '0123456789';
    let capital_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    
    for (let i = 0; i < 5; i++) {
      text += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    for (let i = 0; i < 5; i++) {
      text += capital_letters.charAt(Math.floor(Math.random() * capital_letters.length));
    }
    
    for (let i = 0; i < 5; i++) {
      text += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    }
    return text;
  }
};