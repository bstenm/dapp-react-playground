const tryCatchWrapper = fn => async (...arg) => {
      try {
            return await fn(...arg);
      } catch(e) {
            return e;
      }
}

const assertRevert = (e, msg) => {
      assert(e instanceof Error && e.message.indexOf('revert') >= 0, msg);
};

module.exports = {tryCatchWrapper, assertRevert};
