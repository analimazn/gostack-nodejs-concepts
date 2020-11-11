function findIndex(items, id) {
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex < 0) {
      return { error: 'Not found' };
    }
    
    return { index: itemIndex };
}

module.exports = {
    findIndex
}