#/bin/bash
# travis encrypt ClientID=f967b9f7e1a43c86352f --add
# travis encrypt ClientSecret=2af16bd6374210be726a6447b8e07ff07a458297 --add
# travis encrypt ApiUrl='' --add
# travis encrypt qiniuAccessKey=0xVz06bK5im6mwLKDUmYICsUvmNB90Ec --add
# travis encrypt qiniuSecretKey=kmupVv7vkE-lveBBVSepl0IzvENuy0G_djNy_vH- --add
# travis encrypt qiniuUrl=http://ow5l7f56h.bkt.clouddn.com/ --add


case "$1" in
  dev)
    ClientID=f967b9f7e1a43c86352f \
    ClientSecret=2af16bd6374210be726a6447b8e07ff07a458297 \
    qiniuAccessKey=0xVz06bK5im6mwLKDUmYICsUvmNB90Ec \
    qiniuSecretKey=kmupVv7vkE-lveBBVSepl0IzvENuy0G_djNy_vH- \
    qiniuUrl=http://ow5l7f56h.bkt.clouddn.com/ \
    npm run dev
    ;;
  build)
    ClientID=f967b9f7e1a43c86352f \
    ClientSecret=2af16bd6374210be726a6447b8e07ff07a458297 \
    qiniuAccessKey=0xVz06bK5im6mwLKDUmYICsUvmNB90Ec \
    qiniuSecretKey=kmupVv7vkE-lveBBVSepl0IzvENuy0G_djNy_vH- \
    qiniuUrl=http://ow5l7f56h.bkt.clouddn.com/ \
    npm run build
    ;;
  build:dir)
    ClientID=f967b9f7e1a43c86352f \
    ClientSecret=2af16bd6374210be726a6447b8e07ff07a458297 \
    qiniuAccessKey=0xVz06bK5im6mwLKDUmYICsUvmNB90Ec \
    qiniuSecretKey=kmupVv7vkE-lveBBVSepl0IzvENuy0G_djNy_vH- \
    qiniuUrl=http://ow5l7f56h.bkt.clouddn.com/ \
    npm run build:dir
    ;;
  *)
  echo '输入命令: \n(dev)\t\tsh build.sh dev #开发环境启动'
  echo '(build)\t\tsh build.sh build:dir #生成dmg安装包'
  echo '(build:dir)\tsh build.sh build #生成mac包'
  ;;
esac
exit 0
