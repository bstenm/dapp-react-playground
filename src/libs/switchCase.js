export default cases => {
      let res;
      cases.forEach(e => {
            if (e.case && !res) {
                  res = e.then();
            }
      });
      return res;
};
