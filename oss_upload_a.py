'''
@Date: 2020-04-21 13:27:38
@LastEditTime: 2020-04-21 13:43:02
@Description: file content
'''
# coding:utf-8
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import RpcRequest
import commands
import oss2
import os


class OSS_resouce(object):
    def __init__(self):
        self.auth = oss2.Auth('***', '***')

    def bin_upload_files(self):
        self.bucket = oss2.Bucket(
            self.auth, 'http://oss-cn-beijing.aliyuncs.com', '***')
        for root, dirs, files in os.walk('assets', topdown=False):
            for name in files:
                print os.path.join(root, name)
                self.bucket.put_object_from_file('mtest/{yun_name}'.format(yun_name=os.path.join(
                    root, name)), '{local_name}'.format(local_name=os.path.join(root, name)))

        print 'update '+str(len(name))+' files'


if __name__ == '__main__':
    OSS_resouce().bin_upload_files()
