/* eslint-disable*/

import mockImg from '@/assets/img/material/mock.png';
import diffuse from '@/assets/img/material/diffuse.png';
import gloss from '@/assets/img/material/gloss.png';
import normal from '@/assets/img/material/normal.png';
import specular from '@/assets/img/material/specular.png';

export const testRenderingTexture = {
  diffuse,
  gloss,
  normal,
  specular
};

export const testMaterialRenderingInfo = {
    "renderingJson": {
        "colorAlteration": null,
        "sddat": {
            "materials": [
                {
                    "textures": {
                        "uTexSpecular": {
                            "path": "uploads_SPECULAR.PNG",
                            "offset": [
                                0,
                                0
                            ],
                            "rotation": 0,
                            "scale": [
                                0.06511205434799194,
                                0.06212526187300682
                            ]
                        },
                        "uTexMetallic": null,
                        "uTexRoughness": null,
                        "uTexAlpha": {
                            "path": "uploads_ALPHA.PNG",
                            "offset": [
                                0,
                                0
                            ],
                            "rotation": 0,
                            "scale": [
                                0.06511205434799194,
                                0.06212526187300682
                            ]
                        },
                        "uTexGloss": {
                            "path": "uploads_GLOSS.PNG",
                            "offset": [
                                0,
                                0
                            ],
                            "rotation": 0,
                            "scale": [
                                0.06511205434799194,
                                0.06212526187300682
                            ]
                        },
                        "uTexAnisotropy": null,
                        "uTexColor": {
                            "path": "uploads_COLOR.PNG",
                            "offset": [
                                0,
                                0
                            ],
                            "rotation": 0,
                            "scale": [
                                0.06511205434799194,
                                0.06212526187300682
                            ]
                        },
                        "uTexNormal": {
                            "path": "uploads_NORMAL.PNG",
                            "offset": [
                                0,
                                0
                            ],
                            "rotation": 0,
                            "scale": [
                                0.06511205434799194,
                                0.06212526187300682
                            ]
                        },
                        "uTexHeight": null,
                        "uTexAnisotropyRotation": null
                    },
                    "name": "uploads",
                    "versionPatch": 0,
                    "type": "Fabric",
                    "category": "uploads",
                    "removeColor": false,
                    "versionMajor": 1,
                    "versionMinor": 7,
                    "properties": {
                        "outputBlack": {
                            "type": "int",
                            "value": 0
                        },
                        "emissiveMultiplier": {
                            "type": "float",
                            "value": 0
                        },
                        "specularColor": {
                            "type": "vec3",
                            "value": [
                                0,
                                0,
                                0
                            ]
                        },
                        "kSssFalloffColor": {
                            "type": "vec3",
                            "value": [
                                0,
                                0,
                                0
                            ]
                        },
                        "kSaturate": {
                            "type": "float",
                            "value": 0
                        },
                        "kMetallic": {
                            "type": "float",
                            "value": 0
                        },
                        "removeColor": {
                            "type": "bool",
                            "value": false
                        },
                        "kRs": {
                            "type": "float",
                            "value": 1
                        },
                        "kSssSubsurfacePower": {
                            "type": "float",
                            "value": 0
                        },
                        "outputWhite": {
                            "type": "int",
                            "value": 255
                        },
                        "kIOR": {
                            "type": "float",
                            "value": 1
                        },
                        "kNs": {
                            "type": "float",
                            "value": 1.200000047683716
                        },
                        "kLuminance": {
                            "type": "float",
                            "value": 0
                        },
                        "transmission": {
                            "type": "float",
                            "value": 1
                        },
                        "white": {
                            "type": "int",
                            "value": 255
                        },
                        "kHs": {
                            "type": "float",
                            "value": 1
                        },
                        "emissiveColor": {
                            "type": "vec3",
                            "value": [
                                0,
                                0,
                                0
                            ]
                        },
                        "transmittanceColor": {
                            "type": "vec3",
                            "value": [
                                1,
                                1,
                                1
                            ]
                        },
                        "kAnisotropy": {
                            "type": "float",
                            "value": 0
                        },
                        "uv0Rotation": {
                            "type": "float",
                            "value": 0
                        },
                        "black": {
                            "type": "int",
                            "value": 0
                        },
                        "uv0Scale": {
                            "type": "vec2",
                            "value": [
                                0.06511205434799194,
                                0.06212526187300682
                            ]
                        },
                        "diffuseColor": {
                            "type": "vec3",
                            "value": [
                                1,
                                1,
                                1
                            ]
                        },
                        "kAlpha": {
                            "type": "float",
                            "value": 1
                        },
                        "refractionGlossiness": {
                            "type": "float",
                            "value": 1
                        },
                        "refractionColor": {
                            "type": "vec3",
                            "value": [
                                0,
                                0,
                                0
                            ]
                        },
                        "kAnisotropyRotation": {
                            "type": "float",
                            "value": 0
                        },
                        "kSssAttenuationRadius": {
                            "type": "float",
                            "value": 0
                        },
                        "uv0Offset": {
                            "type": "vec2",
                            "value": [
                                0,
                                0
                            ]
                        },
                        "needAdjustColor": {
                            "type": "bool",
                            "value": false
                        },
                        "kHeightLevel": {
                            "type": "float",
                            "value": 0
                        },
                        "gamma": {
                            "type": "float",
                            "value": 1
                        }
                    }
                }
            ]
        },
        "diffuseMap": "fur/4cf346d8748ed0dfde50431eecc14af7.PNG",
        "alphaMap": "fur/8979da7fbe6799d2fce3e1813f8d8c8c.PNG",
        "materialType": "standardSG",
        "specularMap": "fur/52c5b39b74250de172c447661adddac0.PNG",
        "normalMap": "fur/95c83362858465c373d4db42797679ae.PNG",
        "glossinessMap": "fur/2effab3b42e990600f3f460d24ca960f.PNG",
        "ctmThicknessType": 1
    },
    "id": "1382598431257706498",
    "materialName": "测试",
    "imgJson": {
        "thumbnail": "http://dev.4dshoetech.local/datapipe/repository/furImg/13ed5846ebd497d0fb9c34d3d880729d.PNG?ch=2&rg=CN-SZ-TEST&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0ODkiLCJxcnN1bSI6ImE0OTM4NTdlODRhODMzNWU1NDQ0YzAzNTNiYzk2YmI0IiwicmVzIjoiZnVySW1nLzEzZWQ1ODQ2ZWJkNDk3ZDBmYjljMzRkM2Q4ODA3MjlkLlBORyIsInVpZCI6IjEzMjY3MjgwMDE0OTg0MTUxMDYifQ%3D%3D.2243557402df1bddadd2a13fe8bcadec59c680e46cf0ecb91571272373229428",
        "diffuseMap": "http://dev.4dshoetech.local/datapipe/repository/fur/4cf346d8748ed0dfde50431eecc14af7.PNG?ch=2&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMjc5OTcxODQiLCJxcnN1bSI6IjhhMTA1MmQ5ZDVhMjc5MzJiOGEwYTI2MmRhNTRhNzEzIiwicmVzIjoiZnVyLzRjZjM0NmQ4NzQ4ZWQwZGZkZTUwNDMxZWVjYzE0YWY3LlBORyIsInVpZCI6IjEzMjY3MjgwMDE0OTg0MTUxMDYifQ%3D%3D.efa494d942609921bf122c72740b8a6fee652e9310962055f511979ee7a98a9b",
        "flat": "http://dev.4dshoetech.local/datapipe/repository/flatImg/80d97fbf263c9e2f777505a982ad97c1.PNG?ch=2&rg=CN-SZ-TEST&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0OTQiLCJxcnN1bSI6ImE0OTM4NTdlODRhODMzNWU1NDQ0YzAzNTNiYzk2YmI0IiwicmVzIjoiZmxhdEltZy84MGQ5N2ZiZjI2M2M5ZTJmNzc3NTA1YTk4MmFkOTdjMS5QTkciLCJ1aWQiOiIxMzI2NzI4MDAxNDk4NDE1MTA2In0%3D.2fd4a1206858f7e898fa9e6fe0a8ffd8bc3db2122116001fd89fc31eddfa6261",
        "texture": "http://dev.4dshoetech.local/datapipe/repository/flatImg/b38a9092c2e95639383a70dce345a9e7.PNG?ch=2&rg=CN-SZ-TEST&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0OTEiLCJxcnN1bSI6ImE0OTM4NTdlODRhODMzNWU1NDQ0YzAzNTNiYzk2YmI0IiwicmVzIjoiZmxhdEltZy9iMzhhOTA5MmMyZTk1NjM5MzgzYTcwZGNlMzQ1YTllNy5QTkciLCJ1aWQiOiIxMzI2NzI4MDAxNDk4NDE1MTA2In0%3D.3b2e2c9420c604ab6b09aa6f1d50262985ee0e30bb72ea31db16d52dccb7cb7d",
        "alphaMap": "http://dev.4dshoetech.local/datapipe/repository/fur/8979da7fbe6799d2fce3e1813f8d8c8c.PNG?ch=2&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0OTIiLCJxcnN1bSI6IjhhMTA1MmQ5ZDVhMjc5MzJiOGEwYTI2MmRhNTRhNzEzIiwicmVzIjoiZnVyLzg5NzlkYTdmYmU2Nzk5ZDJmY2UzZTE4MTNmOGQ4YzhjLlBORyIsInVpZCI6IjEzMjY3MjgwMDE0OTg0MTUxMDYifQ%3D%3D.e37d7fc4432b4f7c7e8d4a1aeefe1431ca9a6da98c87ebc44eadbc2067107fc1",
        "specularMap": "http://dev.4dshoetech.local/datapipe/repository/fur/52c5b39b74250de172c447661adddac0.PNG?ch=2&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0OTMiLCJxcnN1bSI6IjhhMTA1MmQ5ZDVhMjc5MzJiOGEwYTI2MmRhNTRhNzEzIiwicmVzIjoiZnVyLzUyYzViMzliNzQyNTBkZTE3MmM0NDc2NjFhZGRkYWMwLlBORyIsInVpZCI6IjEzMjY3MjgwMDE0OTg0MTUxMDYifQ%3D%3D.86170c076ff1cefd943463e19459418ccd6e5151fff468a817a39cfec9a23515",
        "normalMap": "http://dev.4dshoetech.local/datapipe/repository/fur/95c83362858465c373d4db42797679ae.PNG?ch=2&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0OTAiLCJxcnN1bSI6IjhhMTA1MmQ5ZDVhMjc5MzJiOGEwYTI2MmRhNTRhNzEzIiwicmVzIjoiZnVyLzk1YzgzMzYyODU4NDY1YzM3M2Q0ZGI0Mjc5NzY3OWFlLlBORyIsInVpZCI6IjEzMjY3MjgwMDE0OTg0MTUxMDYifQ%3D%3D.0a6ae3cab1b5457d8125f5b4f116eb259447744b96f8ccf3ec346af1eeb0d7cf",
        "glossinessMap": "http://dev.4dshoetech.local/datapipe/repository/fur/2effab3b42e990600f3f460d24ca960f.PNG?ch=2&ticket=eyJjb3JwaWQiOiIxMTgzOTM0ODgxNDA3ODMyMDY2IiwiaWF0IjoxNjIyMTg0MjE0LCJubyI6IjEzOTgxNjgwNDkyMzIxOTE0ODgiLCJxcnN1bSI6IjhhMTA1MmQ5ZDVhMjc5MzJiOGEwYTI2MmRhNTRhNzEzIiwicmVzIjoiZnVyLzJlZmZhYjNiNDJlOTkwNjAwZjNmNDYwZDI0Y2E5NjBmLlBORyIsInVpZCI6IjEzMjY3MjgwMDE0OTg0MTUxMDYifQ%3D%3D.588a1205c47d70774205728e256998316eb0c76b40b42a432d8d2eb9326a76d8"
    },
    "originalId": "1382598431257706498",
}

export const testLastedModelPartInfos = [
    {
        "name": "女鞋",
        "id": "1397040703061626895",
        "modelProp": [
            {
                "id": "1398118070811103233",
                "name": "女鞋-高根鞋",
                "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png",
                "partProp": [
                    {
                        "code": "upper",
                        "name": "鞋面",
                        "itemCode": [
                            {
                                "code": "quarter",
                                "name": "鞋身"
                            }
                        ]
                    },
                    {
                        "code": "lining",
                        "name": "内里",
                        "itemCode": [
                            {
                                "code": "backcounter",
                                "name": "后套里"
                            },
                            {
                                "code": "quarter_lining",
                                "name": "鞋身内里"
                            }
                        ]
                    },
                    {
                        "code": "accessories",
                        "name": "配件",
                        "itemCode": [
                            {
                                "code": "metals",
                                "name": "五金"
                            }
                        ]
                    },
                    {
                        "code": "bottom",
                        "name": "鞋底",
                        "itemCode": [
                            {
                                "code": "heel",
                                "name": "鞋后跟"
                            },
                            {
                                "code": "outsole",
                                "name": "大底"
                            },
                            {
                                "code": "sockliner",
                                "name": "鞋垫"
                            },
                            {
                                "code": "toplift",
                                "name": "天皮"
                            }
                        ]
                    },
                    {
                        "code": "stitches",
                        "name": "缝线",
                        "itemCode": [
                            {
                                "code": "stitching_holes",
                                "name": "缝合孔"
                            },
                            {
                                "code": "stitching_threads",
                                "name": "缝合线"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "1398118220979769346",
                "name": "女鞋-平底鞋",
                "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png",
                "partProp": [
                    {
                        "code": "upper",
                        "name": "鞋面",
                        "itemCode": [
                            {
                                "code": "vamp_logo",
                                "name": "鞋面商标"
                            },
                            {
                                "code": "vamp",
                                "name": "鞋面"
                            },
                            {
                                "code": "quarter",
                                "name": "鞋身"
                            },
                            {
                                "code": "quarter_loop",
                                "name": "鞋身环"
                            }
                        ]
                    },
                    {
                        "code": "lining",
                        "name": "内里",
                        "itemCode": [
                            {
                                "code": "vamp_lining",
                                "name": "鞋面内里"
                            },
                            {
                                "code": "quarter_lining",
                                "name": "鞋身内里"
                            },
                            {
                                "code": "backcounter",
                                "name": "后套里"
                            }
                        ]
                    },
                    {
                        "code": "accessories",
                        "name": "配件",
                        "itemCode": [
                            {
                                "code": "metals",
                                "name": "五金"
                            }
                        ]
                    },
                    {
                        "code": "bottom",
                        "name": "鞋底",
                        "itemCode": [
                            {
                                "code": "sockliner",
                                "name": "鞋垫"
                            },
                            {
                                "code": "outsole",
                                "name": "大底"
                            },
                            {
                                "code": "midsole",
                                "name": "中底"
                            }
                        ]
                    },
                    {
                        "code": "stitches",
                        "name": "缝线",
                        "itemCode": [
                            {
                                "code": "stitching_holes",
                                "name": "缝合孔"
                            },
                            {
                                "code": "stitching_threads",
                                "name": "缝合线"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "1398118468586311681",
                "name": "女鞋-凉鞋",
                "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png",
                "partProp": [
                    {
                        "code": "upper",
                        "name": "鞋面",
                        "itemCode": [
                            {
                                "code": "quarter",
                                "name": "鞋身"
                            }
                        ]
                    },
                    {
                        "code": "accessories",
                        "name": "配件",
                        "itemCode": [
                            {
                                "code": "metals",
                                "name": "五金"
                            }
                        ]
                    },
                    {
                        "code": "bottom",
                        "name": "鞋底",
                        "itemCode": [
                            {
                                "code": "outsole",
                                "name": "大底"
                            },
                            {
                                "code": "midsole",
                                "name": "中底"
                            }
                        ]
                    },
                    {
                        "code": "stitches",
                        "name": "缝线",
                        "itemCode": [
                            {
                                "code": "stitching_holes",
                                "name": "缝合孔"
                            },
                            {
                                "code": "stitching_threads",
                                "name": "缝合线"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "男鞋",
        "id": "1397040703061626813",
        "modelProp": [
            {
                "id": "1397040703061626885",
                "name": "男鞋-运动鞋",
                "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png"
            },
            {
                "id": "1397040703061626886",
                "name": "男鞋-休闲鞋",
                "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png"
            }
        ]
    }
]

export const testModelPartInfos = [
  {
      "name": "女鞋",
      "id": "1397040703061626895",
      "modelProp": [
          {
              "id": "1398118070811103212331",
              "name": "女鞋-高根鞋",
              "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png",
              "partProp": [
                  {
                      "code": "upper",
                      "name": "鞋面",
                      "itemCode": [
                          {
                              "code": "quarter",
                              "name": "鞋身"
                          }
                      ]
                  },
                  {
                      "code": "lining",
                      "name": "内里",
                      "itemCode": [
                          {
                              "code": "backcounter",
                              "name": "后套里"
                          },
                          {
                              "code": "quarter_lining",
                              "name": "鞋身内里"
                          }
                      ]
                  },
                  {
                      "code": "accessories",
                      "name": "配件",
                      "itemCode": [
                          {
                              "code": "metals",
                              "name": "五金"
                          }
                      ]
                  },
                  {
                      "code": "bottom",
                      "name": "鞋底",
                      "itemCode": [
                          {
                              "code": "heel",
                              "name": "鞋后跟"
                          },
                          {
                              "code": "outsole",
                              "name": "大底"
                          },
                          {
                              "code": "sockliner",
                              "name": "鞋垫"
                          },
                          {
                              "code": "toplift",
                              "name": "天皮"
                          }
                      ]
                  },
                  {
                      "code": "stitches",
                      "name": "缝线",
                      "itemCode": [
                          {
                              "code": "stitching_holes",
                              "name": "缝合孔"
                          },
                          {
                              "code": "stitching_threads",
                              "name": "缝合线"
                          }
                      ]
                  }
              ]
          },
          {
              "id": "1398118220979769346",
              "name": "女鞋-平底鞋",
              "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png",
              "partProp": [
                  {
                      "code": "upper",
                      "name": "鞋面",
                      "itemCode": [
                          {
                              "code": "vamp_logo",
                              "name": "鞋面商标"
                          },
                          {
                              "code": "vamp",
                              "name": "鞋面"
                          },
                          {
                              "code": "quarter",
                              "name": "鞋身"
                          },
                          {
                              "code": "quarter_loop",
                              "name": "鞋身环"
                          }
                      ]
                  },
                  {
                      "code": "lining",
                      "name": "内里",
                      "itemCode": [
                          {
                              "code": "vamp_lining",
                              "name": "鞋面内里"
                          },
                          {
                              "code": "quarter_lining",
                              "name": "鞋身内里"
                          },
                          {
                              "code": "backcounter",
                              "name": "后套里"
                          }
                      ]
                  },
                  {
                      "code": "accessories",
                      "name": "配件",
                      "itemCode": [
                          {
                              "code": "metals",
                              "name": "五金"
                          }
                      ]
                  },
                  {
                      "code": "bottom",
                      "name": "鞋底",
                      "itemCode": [
                          {
                              "code": "sockliner",
                              "name": "鞋垫"
                          },
                          {
                              "code": "outsole",
                              "name": "大底"
                          },
                          {
                              "code": "midsole",
                              "name": "中底"
                          }
                      ]
                  },
                  {
                      "code": "stitches",
                      "name": "缝线",
                      "itemCode": [
                          {
                              "code": "stitching_holes",
                              "name": "缝合孔"
                          },
                          {
                              "code": "stitching_threads",
                              "name": "缝合线"
                          }
                      ]
                  }
              ]
          },
          {
              "id": "1398118468586311632181",
              "name": "女鞋-凉鞋",
              "img": "https://sdtc-public-picture.4dshoetech.com/material-library/config/dev/model/f68a44e7f9815311e61ef80d9f9f1b31.png",
              "partProp": [
                  {
                      "code": "upper",
                      "name": "鞋面",
                      "itemCode": [
                          {
                              "code": "quarter",
                              "name": "鞋身"
                          }
                      ]
                  },
                  {
                      "code": "accessories",
                      "name": "配件",
                      "itemCode": [
                          {
                              "code": "metals",
                              "name": "五金"
                          }
                      ]
                  },
                  {
                      "code": "bottom",
                      "name": "鞋底",
                      "itemCode": [
                          {
                              "code": "outsole",
                              "name": "大底"
                          },
                          {
                              "code": "midsole",
                              "name": "中底"
                          }
                      ]
                  },
                  {
                      "code": "stitches",
                      "name": "缝线",
                      "itemCode": [
                          {
                              "code": "stitching_holes",
                              "name": "缝合孔"
                          },
                          {
                              "code": "stitching_threads",
                              "name": "缝合线"
                          }
                      ]
                  }
              ]
          }
      ]
  }
]

export const testColorList = [
  {
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },{
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },{
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },{
    id: '26911401251434496', orgId: '1383030322864648193', colorFamily: '灰色', name: '绣牡丹.4Ddat', colorInfo: 'rgb(128.0000075697899,128.0000075697899,128.0000075697899)', imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538304', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', fileInfo: { '4ddat': 'https://sdtc-test.oss-cn-shenzhen.aliyuncs.com/4ddat/cc4180127f9f5ee6b776d33f7a3e420d.4ddat?ch=1&rg=CN-SZ-TEST' }, imgInfo: { imgUrl_crease: mockImg }, isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(159, 12, 12)', colorInfo: 'rgb(159, 12, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(255, 255, 12)', colorInfo: 'rgb(255, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
  {
    id: '26911401469538314', orgId: '1383030322864648193', colorFamily: '棕色', name: 'rgb(123, 11, 12)', colorInfo: 'rgb(12, 255, 12)', isDefault: 0.0, isBan: 1.0, note: '',
  },
];
