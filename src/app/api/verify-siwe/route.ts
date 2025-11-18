import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(request: NextRequest) {
  try {
    const { message, signature, address } = await request.json();

    // 验证签名
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // 检查恢复的地址是否与声称的地址匹配
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      return NextResponse.json({
        success: true,
        address: recoveredAddress,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "签名验证失败：地址不匹配" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("SIWE 验证错误:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
