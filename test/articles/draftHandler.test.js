import draftHandler from "../../components/articles/DraftHandler.vue"; // テスト対象のページ
import { mount } from "@vue/test-utils";
import axios from "axios";

afterEach(() => {
  jest.restoreAllMocks();
});

// vue-routerのmock
const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => {
    return {
      push: mockPush,
    };
  },
}));

describe("draftHandler_1", () => {
  test("mount draftHandler Component", async () => {
    const wrapper = mount(draftHandler);
    expect(wrapper.text()).toBe("下書き保存");
  });
  test("POSTリクエストが正常に行われる", async () => {
    // モックの作成
    const mockResponse = { data: { message: "Success" } };
    jest.spyOn(axios, "post").mockResolvedValue(mockResponse);

    // コンポーネントのマウント
    const wrapper = mount(draftHandler);

    // POSTリクエストの実行
    await wrapper.find("button").trigger("click");

    const response = await axios.post("/api/article/post", {
      article: "dummy",
    });

    // 期待されるPOSTリクエストのURLやデータを確認するアサーション
    expect(axios.post).toHaveBeenCalledWith("/api/article/post", {
      article: "dammy",
    });
    // 成功メッセージが表示されることを確認するアサーション
    expect(response.data).toEqual({ message: "Success" });

    // マイページへの遷移
    expect(mockPush).toBeCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/myPage");
  });
});
