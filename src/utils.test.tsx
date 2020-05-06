import { getLocalStorageValue, setLocalStorage, dateFormat, sliceDate, getDate, throttle, getTimeDistance, langFormat } from "@Utils";


describe("Testing the utils", () => {


  test("Test getLocalStorageValue & setLocalStorage", () => {
    setLocalStorage("token", "435821599b09fd9f416344c60457777f");
    const storedValue = getLocalStorageValue('token');
    expect(storedValue).toBe("435821599b09fd9f416344c60457777f");

  });


  test("Test dateFormat", () => {
    const formatStr = dateFormat("YY/mm/dd HH:MM:SS", new Date(1588587282289));
    expect(formatStr).toBe("2020/05/04 18:14:42");
  });

  test("Test sliceDate", () => {
    const formatStr1 = sliceDate("2020-04-27T09:39:38.403Z", true);
    expect(formatStr1).toBe("27 Apr 2020");

    const formatStr2 = sliceDate("2020-04-27T09:39:38.403Z");
    expect(formatStr2).toBe("27 Apr 2020 17:39");
  });


  test("Test getDate", () => {
    const tomorrow = getDate(1);
    const yestoday = getDate(-1);
    expect((tomorrow - yestoday) / (1000 * 60 * 60 * 24)).toBe(2);
    expect(Math.ceil((tomorrow - new Date().getTime()) / (1000 * 60 * 60 * 24))).toBe(1);
  });



  test("Test throttle", async () => {
    const test = jest.fn();
    const debounced = throttle(test, 200);

    debounced(null);
    debounced(null);

    expect(test).toHaveBeenCalledTimes(1);
    const timeout300 = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          debounced(null);
          resolve();
        }, 300);
      });
    };
    await timeout300();
    expect(test).toHaveBeenCalledTimes(2);
  });

  test("Test getTimeDistance", () => {
    const now = new Date().getTime();
    const justNowResult = getTimeDistance(new Date(now - 1), 'en');
    expect(justNowResult).toBe('just now');

    const minutesAgoResult = getTimeDistance(new Date(now - 1000 * 61), 'en');
    expect(minutesAgoResult).toBe('1 minutes ago');

    const hoursAgoResult = getTimeDistance(new Date(now - 1000 * 61 * 60), 'en');
    expect(hoursAgoResult).toBe('1 hours ago');

    const yestodayResult = getTimeDistance(new Date(now - 1000 * 61 * 60 * 24), 'en');
    expect(yestodayResult).toBe('Yestoday');

    const daysAgoResult = getTimeDistance(new Date(now - 1000 * 61 * 60 * 24 * 2), 'en');
    expect(daysAgoResult).toBe('2 days ago');
  });

  test("Test langFormat", () => {
    const enResult = langFormat('en', 'justnow');
    const zhResult = langFormat('zh', 'justnow');
    const argResult = langFormat('en', '{0} days ago', [1]);
    expect(enResult).toBe('just now');
    expect(zhResult).toBe('刚刚');
    expect(argResult).toBe('1 days ago');
  });

});
